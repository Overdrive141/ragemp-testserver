// mp.events.add("stopEngine", (player) => {
//     if(!player.vehicle.dead)
// })

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
