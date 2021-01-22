//let laptop
/* 
TODO: 
- Order Shipment from Tablet
- Check: Top 7 Family Only (Turf Access) Available to Rank 12 only.
- 2 MK2, 2 Shotguns, 2 Snipers
- Same Boxes as Train but 10 different coordinates.
- Random Everytime


*/

mp.events.add("server:createTrain", (player) => {
  player.call("createWeaponTrain");
});

// Severniye
// mp.events.add("weaponTrainTakeWeapon", (player, id) =>
// {

// 	//if(player.weaponTrainDelay != null) return false;
// 	//if(!player.inOnCapture || id == null || weaponAmount[id] == null) return false;

// 	if(weaponAmount[id] < 1 || trainState != 1)
// 	{
// 		gm.core.showAlert(player, "alert-red", 'The container is empty');
// 		return false;
// 	}

// 	if(gm.inventory.getInventoryFreeSlots(player, "main") < 1)
// 	{
// 		gm.core.showAlert(player, "alert-red", 'Your inventory is full');
// 		return false;
// 	}

// 	//if(player.getVariable("level") >= 8)
// 	//{
// 	//	var faction = player.getVariable("faction");
// 	//	if(faction == 0 || faction == ARMY_ID || faction == POLICE_ID)
// 	//	{
// 			player.weaponTrainDelay = setTimeout(takeWeaponFinish, 5000, player, id);
// 			gm.core.showAlert(player, "alert-blue", 'Stay close to the train for 5 seconds');
// 			return true;
// 		//}
// 	//}

// 	//return true;
// });
