let gangZone = [];

const gangZoneSize = 100;

const getNative = {
  SET_BLIP_SPRITE: "0xDF735600A4696DAF",
  SET_BLIP_ALPHA: "0x45FF974EEE1C8734",
  SET_BLIP_COLOUR: "0x03D7FB09E75D6B7E",
  SET_BLIP_FLASH_TIMER: "0xD3CD6FD297AE87CC",
  SET_BLIP_FLASHES: "0xB14552383D39CE3E",
  SET_BLIP_ROTATION: "0xF87683CDF73C3F6E",
};

let current_zone = null;
let capture_blip = null; // blip

mp.events.add("client:gangzones:loadZonesData", (json_str) => {
  // Called for all players on login

  gangZone = JSON.parse(json_str);

  for (let id in gangZone) {
    gangZone[id]["blip"] = mp.game.ui.addBlipForRadius(
      gangZone[id]["pos"][0],
      gangZone[id]["pos"][1],
      0.0,
      gangZoneSize
    );

    mp.game.invoke(getNative["SET_BLIP_SPRITE"], gangZone[id]["blip"], 5);
    mp.game.invoke(getNative["SET_BLIP_ALPHA"], gangZone[id]["blip"], 140);
    mp.game.invoke(getNative["SET_BLIP_ROTATION"], gangZone[id]["blip"], 0);
    mp.game.invoke(getNative["SET_BLIP_COLOUR"], gangZone[id]["blip"], 0);

    mp.events.call(
      "client:gangzones:startAttack",
      id,
      gangZone[id]["attacker"]
    );
  }
});
