const JOB_TO_STORAGE = 2;
const JOB_TO_TABLE = 3;
const JOB_PRODUCING = 4;

let drugLabMarker = [1454.77966, -1652.161254, 66.99483];
let drugLabExitMarker = [
  997.0753173828125,
  -3200.570068359375,
  -36.39372634887695,
];
let drugLabColshape = mp.colshapes.newSphere(
  drugLabMarker[0],
  drugLabMarker[1],
  drugLabMarker[2],
  2.0
);
let drugLabExitColshape = mp.colshapes.newSphere(
  drugLabExitMarker[0],
  drugLabExitMarker[1],
  drugLabExitMarker[2],
  2.0
);
mp.markers.new(
  0,
  new mp.Vector3(drugLabMarker[0], drugLabMarker[1], drugLabMarker[2] - 1.0),
  1,
  {
    // direction: direction,
    // rotation: rotation,
    color: [134, 64, 108, 255],
    // visible: visible,
    // dimension: dimension
  }
);

mp.markers.new(
  0,
  new mp.Vector3(
    drugLabExitMarker[0],
    drugLabExitMarker[1],
    drugLabExitMarker[2]
  ),
  1,
  {
    color: [134, 64, 108, 255],
  }
);

mp.events.add("playerEnterColshape", (player, shape) => {
  console.log(shape);
  if (shape == drugLabColshape) {
    player.call("client:teleports:setPos", [
      997.5162963867188 + 5,
      -3200.818603515625 + 5,
      -36.39372634887695,
      1.0,
    ]);
  }
  if (shape == drugLabExitColshape) {
    player.call("client:teleports:setPos", [
      1454.77966 + 5,
      -1652.161254 + 5,
      66.99483,
      1.0,
    ]);
  }
});

mp.events.add("jobDrugmaker", (player, status) => {
  //if (status == JOB_START) {
  //let JOB_START = 1;
  //let attr = [1004.5706176, -3194.959716796875, -38.993125915527344, 5.0];
  //player.call("jobDrugmaker", [JOB_START, attr]);
  //}
  if (status == JOB_TO_STORAGE) {
    console.log("triggered");
    player.notify("Find a table to place your ~g~drugs");
    let object2 = mp.joaat("prop_mp_drug_package");
    // let object2 = mp.objects.new(
    //   "v_med_flask"
    // player.position
    //new mp.Vector3(1005.0596923828125, -3194.94189453125, -38.99312973022461)
    // );
    // object2.attachTo(
    //   player.handle,
    //   0,
    //   0,
    //   0.075,
    //   0.075,
    //   0,
    //   0,
    //   0,
    //   true,
    //   true,
    //   true,
    //   false,
    //   0,
    //   true
    // );
    player.setVariable("bone_attach4", 0);
    player.setvariable(2, 0);

    // player.data.bone_attach0 = 20;
    // console.log(getVar);
    // Done
  }
});

/* SEVERNIYE
mp.events.add("playerEnterColshape", (player, colshape) => 
{
	if(!player.loggedIn) return false;
	if(player.job != JOB_DRUGMAKER) return false;
 
	var id = colshape.druglabTable; // colShapes next to tables.
	if(id != null && tableData[id] != null) // If ID Exists
	{
		if(player.jobStage == JOB_TO_TABLE && tableData[id].inUse == null) // inuse by another player
		{
			player.playAnimation("missmechanic", "work2_base", 8.0, 33);
 
			tableData[id].object = mp.objects.new(mp.joaat("v_med_flask"), new mp.Vector3(tableData[id]["objectPos"][0], tableData[id]["objectPos"][1], tableData[id]["objectPos"][2]));
 
			if(player.drugmakerTimeout != null) clearTimeout(player.drugmakerTimeout);
			player.drugmakerTimeout = setTimeout(productionEnd, gm.utils.getRandomInt(10000, 30000), player); // Get random number between 10 - 30 seconds
 
			player.jobStage = JOB_PRODUCING;
 
			player.call("jobDrugmaker", [JOB_PRODUCING, JSON.stringify(tableData[id]["playerPos"])]);
 
			tableData[id].inUse = true;
			player.drugmakerTable = id;
 
			gm.core.attachObjectToBone(player, 0, null); // Remove object from Bone
 
		}
	}
 
	
	return true;
});

function clearTable(player)
{
	var id = player.drugmakerTable;
	if(id != null)
	{
		if(tableData[id].object != null)
		{
			tableData[id].object.destroy();
			tableData[id].object = null;
		}
		tableData[id].inUse = null;
		player.drugmakerTable = null;
	}
	return true;
}
 
mp.events.add("playerQuit", (player) => {
 
	if(player.drugmakerTimeout != null)
	{
		clearTimeout(player.drugmakerTimeout);
	}
 
	clearTable(player);
 
	return true;
});
 
 
 
mp.events.add('jobDrugmaker', (player, stage) => {
 
	if(debugEnabled) debug("jobDrugmaker");
 
	if(!player.loggedIn) return true;
 
	switch(stage) {
		case JOB_STOP:
			if(player.job != JOB_DRUGMAKER) return true;
 
			player.job 		= null;
			player.jobStage = null;
			player.jobTick 	= null;
 
			if(player.drugmakerTimeout != null)
			{
				clearTimeout(player.drugmakerTimeout);
				player.drugmakerTimeout = null;
			}
 
			clearTable(player);
 
			if(!player.vehicle) player.stopAnimation();
 
			gm.core.attachObjectToBone(player, 0, null);
 
			gm.core.showAlert(player, "alert-green", "You have finished working");
			break;
 
 
		case JOB_START:
			if(player.job != null) return true;
 
			player.job 		= JOB_DRUGMAKER;
			player.jobStage = JOB_START;
			player.jobTick 	= Date.now();
 
			player.call("jobDrugmaker", [JOB_START]);
 
			player.notify("Take a package from the storage (blue marker)");
 
			break;
 
		case JOB_TO_STORAGE:
			if(player.job != JOB_DRUGMAKER) 		return true;
			if(player.jobStage != JOB_START) 		return true;
			if(Date.now()-player.jobTick < 500) 	return true;
 
			player.notify("Find a free table");
 
			player.stopAnimation();
			player.playAnimation("anim@heists@box_carry@", "run", 8.0, 48);
 
			gm.core.attachObjectToBone(player, 0, 20);
 
			player.jobStage = JOB_TO_TABLE;
 
			break;
	}
 
	return true;
});
 
function productionEnd(player)
{
	if(debugEnabled) debug("s:jobDrugmaker:productionEnd");
 
	if(mp.players.exists(player))
	{
		player.drugmakerTimeout = null;
 
		if(player.job != JOB_DRUGMAKER) 		return false;
		if(player.jobStage != JOB_PRODUCING) 		return false;
 
		player.jobStage = JOB_START;
		player.jobTick 	= Date.now();
 
		clearTable(player);
 
		player.notify("Take a package from the storage (blue marker)");
 
		player.stopAnimation();
 
		gm.inventory.addInventoryItemStack(player, "main", "Drugs", INVENTORY_DRUGS, "drugs", 1, 1);
 
		gm.core.setBubbleText(player, "~g~+1");
	}
	return true;
}
*/
