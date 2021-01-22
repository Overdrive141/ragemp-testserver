mp.events.add("vehicleDamage", (vehicle, bodyHealthLoss, engineHealthLoss) => {
  // Do what you want.
  console.log(
    vehicle + "BODY: " + bodyHealthLoss + "ENGINE: " + engineHealthLoss
  );
  if (bodyHealthLoss > 50)
    mp.players.call(
      mp.players.toArray().filter((_player) => _player.name == "WeirdNewbie"),
      "stopEngineClient"
    );
});

mp.events.add("tryToStartEngine", (player) => {
  // if (debugEnabled) debug("tryToStartEngine");

  if (player.vehicle && player.seat == -1) {
    // if(player.vehicle.getVariable("inactive") == true)
    // {
    // 	if(player.vehicle.sqlID && player.vehicle.owner < 0)
    // 	{
    // 		gm.core.showAlert(player, 'alert-red', 'This vehicle is inactive because the family does not have enough rating!');
    // 	}
    // 	return true;
    // }
    // // Starts the motor, then all the checks can start, etc
    // if(player.vehicle.sqlID)
    // {
    // 	if(player.vehicle.numberPlate == "")
    // 	{
    // 		player.notify("~r~The vehicle doesn't have a number plate");
    // 		return true;
    // 	}

    // 	// You can start a car if
    // 	if(!gm.inventory.hasVehicleKey(player, player.vehicle) &&
    // 		player.sqlID != player.vehicle.owner &&
    // 		player.family != -player.vehicle.owner)
    // 	{
    // 		gm.core.showAlert(player, 'alert-red', "You can't drive this vehicle without the key!");
    // 		return true;
    // 	}
    // }

    // if(player.vehicle.faction)
    // {
    // 	if(player.vehicle.faction != player.getVariable("faction"))
    // 	{
    // 		player.vehicle.engine = false;
    // 		gm.core.showAlert(player, 'alert-red', "You can't drive this vehicle!");
    // 		return true;
    // 	}

    // 	if(player.rank < player.vehicle.rankFrom)
    // 	{
    // 		player.vehicle.engine = false;
    // 		gm.core.showAlert(player, 'alert-red', 'This vehicle is available form rank '+player.vehicle.rankFrom);
    // 		return true;
    // 	}
    // }

    // if(player.vehicle.onlyFor)
    // {
    // 	if(player.vehicle.onlyFor != player.sqlID) return gm.core.showAlert(player, 'alert-red', 'This vehicle is prepared for another player!');
    // }

    // let vehicle_fuel_data = module.exports.getVehicleFuelDataByHash(player.vehicle.model);

    // if(vehicle_fuel_data["vehicle_fuel_data"] != "no")
    // {
    // 	if(!player.vehicle.fuel) player.vehicle.fuel = 0.0;

    // 	if(player.vehicle.fuel <= 0.0) return gm.core.showAlert(player, 'alert-red', 'Out of fuel. Buy a fuel can!');
    // }

    // player.vehicle.engine = true;
    player.call("startStopEngine", [true]);
    // player.call("fixVehicleLights");

    // if(player.privateCar == player.vehicle)
    // {
    // 	player.vehicle.locked = true;
    // 	player.notify("~g~Vehicle locked");
    // 	player.call("hudSetVehicleDoorLock", [true]);
    // }

    // if(player.vehicle.getVariable("hoodSync") != [false, false, false, false, false, false])
    // {
    // 	player.vehicle.setVariable("hoodSync", [false, false, false, false, false, false]);
    // }
  }

  return true;
});

mp.events.add("stopEngine", (player) => {
  // Button from the client when inside the car

  // if (debugEnabled) debug("stopEngine");

  if (player.vehicle && player.seat == -1) {
    player.vehicle.engine = false;
    player.vehicle.locked = false;
    // player.call("hudSetVehicleDoorLock", [false]);
  }

  return true;
});
