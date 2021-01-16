let speedCameraRotations = [
  new mp.Vector3(0, 0, 200),
  new mp.Vector3(0, 0, 15),
];
let speedCameraPositions = [
  new mp.Vector3(748.37, 111.21, 78.11),
  new mp.Vector3(734.7, 52, 82.3),
];
let speedCameraModel = "prop_cctv_pole_01a";
for (let i in speedCameraPositions) {
  mp.objects.new(speedCameraModel, speedCameraPositions[i], {
    rotation: speedCameraRotations[i],
  });
}

const markerRange = 60;
const markerColor = [174, 219, 242, 150];
const pos1 = new mp.Vector3(733, 70, 82);

// const speedCameraRadius = mp.colshapes.newSphere(
//   756.49,
//   80.4,
//   80.6,
//   markerRange
// );

const speedCameraRadius = mp.colshapes.newRectangle(733, 70, 100, 100);

mp.markers.new(43, pos1, markerRange, {
  visible: false,
  color: markerColor,
  //   rotation: pos1,
});
mp.blips.new(361, pos1, {
  name: "Camera",
  //shortRange: true
});

speedCameraRadius.speedCamera = true;

const playerEnterColshapeHandler = (player, shape) => {
  if (shape == speedCameraRadius) {
    // if (player.vehicle) {
    console.log(shape.speedCamera);
    // player.call("cameraTrigger");
    // console.log(player.vehicle);
    // let speedVar = player.vehicle.getSpeed();
    player.call("cameraTrigger");
    //   console.log("")
    //   player.call("cameraTrigger", speedVar);
    // }
  }
};

mp.events.add("playerEnterColshape", playerEnterColshapeHandler);
