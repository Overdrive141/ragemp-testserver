let canTakeWeapon = null;

let trainElementsPos = [
  null,
  {
    type: "objects",
    model: "prop_rail_boxcar",
    x: 14.4,
    y: 5.4,
    z: 0,
    rx: 10,
    ry: 0,
    rz: 40,
  },
  {
    type: "objects",
    model: "prop_rail_boxcar4",
    x: 29,
    y: 10.4,
    z: 0,
    rx: -20,
    ry: 0,
    rz: 0,
  },
  {
    type: "vehicles",
    model: "freight",
    x: 45,
    y: 13.7,
    z: 1.7,
    rx: 0,
    ry: -90,
    rz: -70,
  },
  {
    type: "objects",
    model: "xm_prop_crates_pistols_01a",
    x: 1,
    y: 3,
    z: -0.2,
    rx: 0,
    ry: 0,
    rz: 90,
    weapon: 0,
  }, // pistols
  {
    type: "objects",
    model: "xm_prop_crates_weapon_mix_01a",
    x: -4,
    y: -4,
    z: -0.2,
    rx: 0,
    ry: 0,
    rz: 90,
    weapon: 1,
  }, // ammo pistols
  {
    type: "objects",
    model: "xm_prop_crates_rifles_01a",
    x: 25,
    y: 7.5,
    z: -0.1,
    rx: 0,
    ry: 0,
    rz: 90,
    weapon: 2,
  }, // rifles
  {
    type: "objects",
    model: "xm_prop_crates_weapon_mix_01a",
    x: 30,
    y: 15,
    z: -0.1,
    rx: 0,
    ry: 0,
    rz: 0,
    weapon: 3,
  }, // ammo rifles
];

let trainElements = [];
let trainStreamColshape = null;
let trainColshapes = [];

mp.events.add("createWeaponTrain", () => {
  destroyTrainElements();
  destroyTrainColshapes();

  let pos = [4.61, 11.51, 70.77];

  trainElements[0] = mp.objects.new(
    mp.game.joaat("prop_rail_boxcar4"),
    new mp.Vector3(pos[0], pos[1], pos[2] - 1),
    { rotation: new mp.Vector3(0, 0, pos[3] + 70) }
  ); // last carriage

  for (var i = 1; i < trainElementsPos.length; i++) {
    trainElements[i] = mp[trainElementsPos[i].type].new(
      mp.game.joaat(trainElementsPos[i].model),
      new mp.Vector3(pos[0], pos[1], pos[2])
    );
  }

  trainStreamColshape = mp.colshapes.newSphere(
    pos[0],
    pos[1],
    pos[2] - 20,
    250.0
  );
});

mp.events.add("destroyWeaponTrain", () => {
  destroyTrainElements();
  destroyTrainColshapes();
});

function destroyTrainColshapes() {
  for (var i = 0; i < trainColshapes.length; i++) {
    trainColshapes[i].destroy();
  }
  trainColshapes = [];
}

function destroyTrainElements() {
  for (var i = 0; i < trainElements.length; i++) {
    trainElements[i].destroy();
  }
  trainElements = [];

  if (trainStreamColshape != null) {
    trainStreamColshape.destroy();
    trainStreamColshape = null;
  }
}

function processAttachments() {
  destroyTrainColshapes();

  for (var i = 1; i < trainElements.length; i++) {
    trainElements[i].attachTo(
      trainElements[0].handle,
      0,
      trainElementsPos[i].x,
      trainElementsPos[i].y,
      trainElementsPos[i].z,
      trainElementsPos[i].rx,
      trainElementsPos[i].ry,
      trainElementsPos[i].rz,
      false,
      false,
      true,
      false,
      2,
      true
    );

    if (trainElementsPos[i].weapon != null) {
      var pos = mp.game.object.getObjectOffsetFromCoords(
        trainElements[0].position.x,
        trainElements[0].position.y,
        trainElements[0].position.z,
        trainElements[0].rotation.z,
        trainElementsPos[i].x,
        trainElementsPos[i].y,
        trainElementsPos[i].z
      );
      //var shape = mp.markers.new(1, new mp.Vector3(pos.x, pos.y, pos.z), 5, { color: [134,64,108,255] }); //z-1.0
      var shape = mp.colshapes.newSphere(pos.x, pos.y, pos.z - 1, 4);
      shape.weaponTrainSpot = trainElementsPos[i].weapon;
      trainColshapes.push(shape);
    }
  }
}

mp.events.add("playerEnterColshape", (shape) => {
  if (shape == trainStreamColshape) {
    processAttachments();
    return;
  }
  if (shape.weaponTrainSpot != null) {
    mp.game.graphics.notify("[E] open container");
    canTakeWeapon = shape.weaponTrainSpot;
  }
});

mp.events.add("playerExitColshape", (shape) => {
  if (shape.weaponTrainSpot != null) {
    canTakeWeapon = null;
  }
});

mp.keys.bind(0x45, true, () =>
  // E
  {
    if (canTakeWeapon == null || localPlayer.isDead() || mp.gui.cursor.visible)
      return false;
    mp.events.callRemote("weaponTrainTakeWeapon", canTakeWeapon);
  }
);
