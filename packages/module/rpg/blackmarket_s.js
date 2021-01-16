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
