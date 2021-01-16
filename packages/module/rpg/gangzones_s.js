// const id = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
// const owner = 38;
// const x = [470, 70, 70, -130, -130, -130, -330, 330, 1408, 70, 70, 270];
// const y = [
//   -2080,
//   -1480,
//   -1280,
//   -1680,
//   -1480,
//   -1280,
//   -1480,
//   -1280,
//   -1760,
//   -1680,
//   -1880,
//   -1280,
// ];

const data = [
  { id: 0, owner: 38, x: 470, y: -2080 },
  { id: 1, owner: 38, x: 70, y: -1480 },
  { id: 2, owner: 38, x: 70, y: -1280 },
  { id: 3, owner: 38, x: -130, y: -1680 },
  { id: 4, owner: 38, x: -130, y: -1480 },
  { id: 5, owner: 38, x: -130, y: -1280 },
  { id: 6, owner: 38, x: -330, y: -1480 },
  { id: 7, owner: 38, x: -330, y: -1280 },
  { id: 8, owner: 38, x: 1408, y: -1760 },
  { id: 9, owner: 38, x: 70, y: -1680 },
  { id: 10, owner: 38, x: 70, y: -1880 },
  { id: 11, owner: 38, x: 270, y: -1280 },
  { id: 12, owner: 38, x: -360, y: 6150 },
  { id: 13, owner: 38, x: -360, y: 6350 },
  { id: 14, owner: 38, x: -160, y: 6350 },
  { id: 15, owner: 38, x: -160, y: 6550 },
  { id: 16, owner: 38, x: 40, y: 6550 },
];

let gangZone = [];

function addZone(id, owner, x, y) {
  gangZone[id] = {
    owner: owner,
    //"color": 	color,
    pos: [x, y],

    attacker: null,
    owner_count: 0,
    attacker_count: 0,

    timer: 0,

    colshape: mp.colshapes.newRectangle(x, y, 50 * 1.9, 50 * 1.9),
  };

  gangZone[id]["colshape"]["gangZone"] = id;
}

mp.events.add("server:loadZones", (player) => {
  console.log(data);
  console.log(JSON.stringify(gangZone));

  for (let zone = 0; zone < data.length; zone++) {
    addZone(
      data[zone]["id"],
      data[zone]["owner"],
      data[zone]["x"],
      data[zone]["y"]
    );
  }

  let json_str = JSON.stringify(gangZone);

  player.call("client:gangzones:loadZonesData", [json_str]);

  //return true;
});
