//stalling system
// let bodyHealth = localPlayer.vehicle.getEngineHealth();

// if (bodyHealth < 60 && localPlayer.vehicle.getIsEngineRunning())
//   vehicle.setEngineOn(false, true, true);
// setTimeout(() => {
//   if (!mp.game.vehicle.getIsEngineRunning())
//     vehicle.setEngineOn(false, false, false);
// }, 10000);

// if (localPlayer.vehicle) {
//   if (localPlayer.vehicle.doesHaveWeapons()) {
//     mp.game.controls.disableControlAction(2, 68, true);
//     mp.game.controls.disableControlAction(2, 69, true);
//     mp.game.controls.disableControlAction(2, 70, true);
//   }
// }

/*
severniye
mp.keys.bind(0x42, true, function() { // b

	if(mp.gui.cursor.visible) return false;
	
	if(localPlayer.vehicle)
	{
		if(localPlayer.vehicle.getPedInSeat(-1) == localPlayer.handle)
		{
			// anim fix
			mp.game.controls.disableControlAction(27, 71, true);
			mp.game.controls.disableControlAction(27, 72, true);

    		if(localPlayer.vehicle.getIsEngineRunning() == true)
    		{
    			stopAutopilot(false);
    			localPlayer.vehicle.setEngineOn(false, false, true);
    			mp.events.callRemote('stopEngine'); 
    		}
    		else 
    		{
    			mp.events.callRemote('tryToStartEngine'); 
    		}
    	}
	}
	else
	{
		let vehicle = getClosestVehicle(localPlayer.position, 5.0);

		if(vehicle) mp.events.callRemote("server:vehicle_system:lockUnlock", vehicle); 
	}
});

*/

mp.keys.bind(0x42, true, function () {
  // b vehicle.setEngineOn(toggle, instantly, otherwise);

  //let loops = parseInt((1000 - bodyHealth) / 100);

  if (mp.gui.cursor.visible) return false;

  if (localPlayer.vehicle) {
    if (localPlayer.vehicle.getPedInSeat(-1) == localPlayer.handle) {
      // anim fix
      mp.game.controls.disableControlAction(27, 71, true);
      mp.game.controls.disableControlAction(27, 72, true);

      if (localPlayer.vehicle.getIsEngineRunning() == true) {
        //stopAutopilot(false);
        localPlayer.vehicle.setEngineOn(false, false, true);
        mp.events.callRemote("stopEngine");
      } else {
        // if (loops < 80) {
        //   localPlayer.vehicle.setEngineOn(true, false, false);
        // }
        mp.events.callRemote("tryToStartEngine");
        // localPlayer.vehicle.setEngineOn(true, false, true);
      }
    }
  }
  //  else {
  //   let vehicle = getClosestVehicle(localPlayer.position, 5.0);

  //   if (vehicle)
  //     mp.events.callRemote("server:vehicle_system:lockUnlock", vehicle);
  // }
});

// For the character does not try to start the car
mp.events.add("stopEngineClient", () => {
  if (localPlayer.vehicle) {
    localPlayer.vehicle.setEngineOn(false, false, true);
    //stopAutopilot();
  }
});

mp.events.add("startStopEngine", (state) => {
  let veh_hp = localPlayer.vehicle.getEngineHealth() / 10;

  if (state) {
    if (veh_hp < 80) localPlayer.vehicle.setEngineOn(true, false, false);
  }
});
