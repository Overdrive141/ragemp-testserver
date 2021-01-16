require("./rpg/syncedComponents_s");
require("./rpg/exampleCommands");
require("./rpg/testSCam_s");
require("./rpg/mdc_s");
require("./rpg/utils_s");
require("./rpg/police_s");
require("./rpg/druglab_s");
require("./rpg/vehicles_s");
require("./rpg/gangzones_s");
//require("./rpg/blackmarket_s");
// require("./MapEditorServer.js")

global.gm = {};

gm.mysql = require("./dbconnect.js");

mp.events.add("playerJoin", (player) => {
  player.outputChatBox("RolePlayClub Test: Welcome Bro");
  player.loggedIn = true;
  mp.events.call("server:loadZones", player);
  mp.events.call("server:createTrain", player);
  // player.model = mp.joaat("mp_f_freemode_01");
});

mp.events.add("showAlert", (data) => {
  var json_str = JSON.parse(data);
  global.showAlert(json_str[0], json_str[1]);
});

global.showAlert = function (style, message) {
  mp.gui.cef.execute('alerts.message("' + style + '", "' + message + '");');
};

// =================================================
// ==================Commands=======================
// =================================================

mp.events.addCommand("color", (player, fulltext, c1, c2, c3, c4, c5, c6) => {
  player.vehicle.setColorRGB(c1, c2, c3, c4, c5, c6);
});

mp.events.addCommand("weapon", (player, weapon, ammo) => {
  let weaponHash = mp.joaat(weapon);
  player.giveWeapon(weaponHash, parseInt(ammo) || 10000);
});

mp.events.addCommand("time", (player, fulltext, hour, minute, second) =>
  mp.world.time.set(hour, minute, second)
);

// Spawn Vehicle
mp.events.addCommand({
  v: (player, name) => {
    if (!name) return player.outputChatBox("/v [vehicle name]");
    if (typeof player.veh !== "undefined") player.veh.destroy();
    mp.vehicles.new(
      mp.joaat(name),
      new mp.Vector3(
        player.position.x + 1.2,
        player.position.y,
        player.position.z
      ),
      {
        color: [
          [255, 255, 255],
          [0, 0, 0],
        ],
      }
    );
  },
});

mp.events.add("playerCommand", (player, command) => {
  let arr = command.split(" ");
  if (arr[0] == "setclothes") {
    if (
      arr.length < 5 ||
      parseInt(arr[1]) === undefined ||
      parseInt(arr[2]) === undefined ||
      parseInt(arr[3]) === undefined ||
      parseInt(arr[4]) === undefined
    ) {
      return player.outputChatBox(
        "Use syntax: /setclothes [component_id] [drawable_id] [texture_id] [palette_id]"
      );
    } else {
      player.setClothes(
        parseInt(arr[1]),
        parseInt(arr[2]),
        parseInt(arr[3]),
        parseInt(arr[4])
      );
    }
  }
});

// mp.events.addCommand({
//   object: (player, name) => {
//     // if (typeof player.obj !== "undefined") player.obj.destroy();
//     // player.obj = mp.objects.new(
//     //   mp.joaat(name),
//     //   new mp.Vector3(
//     //     player.position.x + 1.2,
//     //     player.position.y,
//     //     player.position.z
//     //   ),
//     //   {}
//     // );
//     player.call("loadModel", [name]);
//     player.obj = mp.objects.new(
//       mp.joaat(name),
//       new mp.Vector3(
//         player.position.x + 1.2,
//         player.position.y,
//         player.position.z
//       ),
//       {}
//     );
//   },
// });

// mp.events.add("playerCommand", (command) => {
//   const args = command.split(/[ ]+/);
//   const commandName = args[0];

//   args.shift();

//   if (commandName == "object") {
//     mp.objects.new(mp.game.joaat(args[0]), localPlayer.position, {});
//   }
// });

// =================================================
// ======================Test=======================
// =================================================

// mp.events.add({
//   entityCreated: (entity) => {
//     if (entity.type == "vehicle") {
//       entity.doors = [0, 0, 0, 0, 0, 0, 0];
//     }
//   },
//   "server.vehicles.sync.doors": (player, vehicle, doors) => {
//     vehicle.doors = JSON.parse(doors);
//     mp.players.call(player.streamedPlayers, "client.vehicles.sync.doors", [
//       vehicle,
//       JSON.stringify(vehicle.doors),
//     ]);
//     player.call("client.vehicles.sync.doors", [
//       vehicle,
//       JSON.stringify(vehicle.doors),
//     ]);
//   },
//   "server.vehicles.get.sync.doors": (player, vehicle) => {
//     if (typeof vehicle.doors == "object") {
//       player.call("client.vehicles.sync.doors", [
//         vehicle,
//         JSON.stringify(vehicle.doors),
//       ]);
//     }
//   },
// });

// mp.events.add("toggleIndicator", (player, indicatorID) => {
//   let vehicle = player.vehicle;
//   if (vehicle && player.seat == -1) {
//     // Player.Seat == -1 is Driver Seat
//     switch (indicatorID) {
//       // Right
//       case 0:
//         vehicle.data.IndicatorRight = !vehicle.data.IndicatorRight;
//         break;

//       // Left
//       case 1:
//         vehicle.data.IndicatorLeft = !vehicle.data.IndicatorLeft;
//         break;
//     }
//   }
// });

mp.events.add("cameraEvent", (player, speed) => {
  // let vehicle = player.vehicle;
  // let speed = vehicle.data.getSpeed();
  // let currentSpeed = vehicle.setVariable("currentSpeed", speed);
  // let currentSpeed = vehicle.getVariable("currentSpeed");
  // player.call("", currentSpeed);
  // console.log(player + currentSpeed);
  player.outputChatBox(`You were caught speeding above ${speed}`);
});

// mp.events.add("playerMoving", (player) => {
// player.playAnimation('reload_aim', )
// })
