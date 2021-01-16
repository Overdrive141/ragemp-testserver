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
    player.setvariable("bone_attach2", 0);

    // player.data.bone_attach0 = 20;
    // console.log(getVar);
    // Done
  }
});
