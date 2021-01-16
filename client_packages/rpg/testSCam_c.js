// mp.events.add("entityStreamIn", (entity) => {
//   // let vehicle = mp.players.local.vehicle;
//   if (entity.type === "vehicle") {
//     let vehicle = mp.players.local.vehicle;
//     let speedVar = entity.getSpeed();
//     let speed = entity.getVariable("currentSpeed");
//     mp.game.graphics.drawText("Hi", [0.5, 0.005], {
//       font: 6,
//       color: [255, 255, 255, 255],
//       scale: [1.0, 1.0],
//       outline: true,
//     });
//     if (speed >= 20) {
//       mp.game.ui.setNotificationTextEntry("STRING");
//       mp.game.ui.setNotificationMessage(
//         "CHAR_CHAT_CALL",
//         "CHAR_CHAT_CALL",
//         false,
//         4,
//         "Speed Camera",
//         "You have been caught speeding"
//       );
//       mp.game.ui.drawNotification(true, false);
//     }
//   }
// });

// mp.events.add("render", () => {
//   if (mp.players.local.vehicle) {
//     let speedVar = mp.players.local.vehicle.getSpeed();
//     mp.game.graphics.drawText(speedVar, [0.5, 0.005], {
//       font: 6,
//       color: [255, 255, 255, 255],
//       scale: [1.0, 1.0],
//       outline: true,
//     });
//     if (speedVar >= 20) {
//       mp.game.ui.setNotificationTextEntry("STRING");
//       mp.game.ui.setNotificationMessage(
//         "CHAR_CHAT_CALL",
//         "CHAR_CHAT_CALL",
//         false,
//         4,
//         "Speed Camera",
//         "You have been caught speeding"
//       );
//       mp.game.ui.drawNotification(true, false);
//       mp.events.callRemote("cameraEvent", speedVar);
//     }
//   }
// });

// mp.events.add("MarkerEvent", () => {
// const markerRange = 80;
// const markerColor = [174, 219, 242, 150];
// const pos1 = new mp.Vector3(756.49, 80.4, 80.6);

// const speedCameraRadius = mp.colshapes.newSphere(
//   756.49,
//   80.4,
//   80.6,
//   markerRange
// );
// mp.markers.new(1, pos1, markerRange, {
//   visible: true,
//   color: markerColor,
// });
// mp.blips.new(361, pos1, {
//   name: "Camera",
//   //shortRange: true
// });
// });

// mp.events.addDataHandler("currentSpeed", (entity, speed) => {
//   if (entity.type === "vehicle") {
//     mp.events.callRemote("cameraEvent");
//     if (speed >= 20) {
//       console.log(speed);
//       mp.game.ui.setNotificationTextEntry("STRING");
//       mp.game.ui.setNotificationMessage(
//         "CHAR_CHAT_CALL",
//         "CHAR_CHAT_CALL",
//         false,
//         4,
//         "Speed Camera",
//         "You have been caught speeding"
//       );
//       mp.game.ui.drawNotification(true, false);
//       // mp.events.callRemote("cameraEvent");
//     }
//   }
// });

// mp.events.addDataHandler("Hood", (entity, hoodOpen) => {
//   if (entity.type === "vehicle" && hoodOpen) {
//     entity.setDoorShut(4, false);
//   } else if (entity.type === "vehicle" && !hoodOpen) {
//     entity.setDoorOpen(4, false, false);
//   }
// });

mp.events.add("cameraTrigger", () => {
  // Check for Overspeeding
  // mp.gui.chat.push("bacha trigger");
  let vehicle = mp.players.local.vehicle;
  if (vehicle) {
    let speedVar = vehicle.getSpeed();
    if (speedVar >= 20) {
      mp.game.ui.setNotificationTextEntry("STRING");
      mp.game.ui.setNotificationMessage(
        "CHAR_CHAT_CALL",
        "CHAR_CHAT_CALL",
        false,
        4,
        "Speed Camera",
        "You have been caught speeding"
      );
      mp.game.ui.drawNotification(true, false);
      mp.gui.chat.push("You are overspeeding LINWOOD" + speedVar);
    }
    // mp.game.graphics.drawText(speedVar, [0.5, 0.005], {
    //   font: 6,
    //   color: [255, 255, 255, 255],
    //   scale: [1.0, 1.0],
    //   outline: true,
    // });
  }
});

