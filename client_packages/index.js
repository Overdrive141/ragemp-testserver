global.localPlayer = mp.players.local;
localPlayer.job = null;

global.JOB_START = 1;
global.JOB_STOP = 0;

global.JOB_ELECTRICIAN = 1;
global.JOB_TRUCKER = 2;
global.JOB_DOCKER = 3;
global.JOB_AQUANAUT = 4;
global.JOB_MINER = 5;
global.JOB_PILOT = 6;
global.JOB_LUMBERJACK = 7;
global.JOB_DRUGMAKER = 8;

global.JOB_LEVEL_BOOST = 10;

global.BLOCK_CONTROLS = false;
global.BLOCK_CONTROLS_DURING_ANIMATION = false;

global.ENABLE_VOICE_WITH_CURSOR = false;

// let return_cursor_after_afk = false;

// let bloodDelay = 0;
// let lastHp = 0;
// let blood = false;
// let bloodCount = 0;

// nametags
// mp.nametags.enabled = false;
// const maxDistance = 20 * 20;
// cconst width = 0.045;
// cconst height = 0.0065;
// cconst border = 0.001;

mp.game.streaming.requestIpl("ex_sm_15_office_03a"); // City Hall

require("./rpg/syncedComponents_c"); // Clothes
require("./rpg/testSCam_c"); // Speed Cam
require("./rpg/noclip_c"); // Fly
require("MapEditor/MapEditor.js");
require("MapEditor/object_data.js");
require("MapEditor/Natives.js");
// require("admin/index.js");
require("./rpg/doors_c.js"); // Doors Control
require("./rpg/mdc_c.js");
require("./rpg/factions_c.js");
require("./rpg/druglab_c.js");
require("./rpg/teleports_c.js");
require("./rpg/vehicles_c.js");
require("./rpg/gangzones_c.js");
//require("./rpg/weapon_train_c.js");
// require("./voice_c");

//mp.discord.update(`Playing on NoneOfYourBusiness`, "Playing as GoAwayStalker");
// mp.players.local.model = "mp_f_freemode_01";
mp.gui.cef = mp.browsers.new("package://rpg/interface/index.html");

// const localPlayer = mp.players.local;
// let genderHash = "mp_m_freemode_01"wa
// if (gender != "Male")
//   genderHash = "mp_f_freemode_01"
// let genderModel = mp.game.joaat(genderHash)
// localPlayer.model = genderModel

mp.events.add("showAlert", (data) => {
  var json_str = JSON.parse(data);
  global.showAlert(json_str[0], json_str[1]);
});

global.showAlert = function (style, message, type) {
  mp.gui.cef.execute(
    'alerts.progress("' + style + '", "' + message + '", "' + type + '");'
  );
};

mp.events.add("render", () => {
  let x = mp.players.local.position.x;
  let y = mp.players.local.position.y;
  let z = mp.players.local.position.z;

  mp.game.graphics.drawText(x + "," + y + "," + z, [0.5, 0.005], {
    font: 4,
    color: [255, 255, 255, 255],
    scale: [1.0, 1.0],
    outline: true,
  });

  mp.game.gameplay.setFadeOutAfterDeath(false);

  // veh weapons
  if (localPlayer.vehicle) {
    if (localPlayer.vehicle.doesHaveWeapons()) {
      mp.game.controls.disableControlAction(2, 68, true);
      mp.game.controls.disableControlAction(2, 69, true);
      mp.game.controls.disableControlAction(2, 70, true);
    }
  }

  // controls
  if (BLOCK_CONTROLS == true) {
    //mp.game.invoke('0x5E6CC07646BBEAB8', mp.players.local.handle, true); // DISABLE_PLAYER_FIRING

    mp.game.controls.disableControlAction(0, 257, true); // FIRING

    mp.game.controls.disableControlAction(2, 30, true);
    mp.game.controls.disableControlAction(2, 31, true);
    mp.game.controls.disableControlAction(0, 23, true);
    mp.game.controls.disableControlAction(0, 75, true);

    mp.game.controls.disableControlAction(2, 92, true);
    mp.game.controls.disableControlAction(2, 24, true);
    mp.game.controls.disableControlAction(2, 69, true);
    mp.game.controls.disableControlAction(2, 70, true);

    mp.game.controls.disableControlAction(2, 140, true);
    mp.game.controls.disableControlAction(2, 141, true);
    mp.game.controls.disableControlAction(2, 263, true);
    mp.game.controls.disableControlAction(2, 264, true);
  }

  if (BLOCK_CONTROLS_DURING_ANIMATION == true) {
    //mp.game.invoke('0x5E6CC07646BBEAB8', mp.players.local.handle, true); // DISABLE_PLAYER_FIRING
    mp.game.controls.disableControlAction(0, 257, true); // FIRING
    mp.game.controls.disableControlAction(0, 22, true);
    mp.game.controls.disableControlAction(2, 25, true);
    mp.game.controls.disableControlAction(0, 23, true); // INPUT_ENTER

    mp.game.controls.disableControlAction(2, 24, true);
    mp.game.controls.disableControlAction(2, 69, true);
    mp.game.controls.disableControlAction(2, 70, true);
    mp.game.controls.disableControlAction(2, 92, true);

    mp.game.controls.disableControlAction(2, 140, true);
    mp.game.controls.disableControlAction(2, 141, true);
    mp.game.controls.disableControlAction(2, 263, true);
    mp.game.controls.disableControlAction(2, 264, true);
  }

  // always end
  // if (player.bubbleText) {
  //   y -= 0.025;

  //   let bubble_opacity = 350 - player.bubbleText[1];

  //   if (bubble_opacity > 255) bubble_opacity = 255;

  //   graphics.drawText(
  //     player.bubbleText[0],
  //     [x, y - player.bubbleText[1] / 7000],
  //     {
  //       font: 4,
  //       color: [255, 255, 255, bubble_opacity],
  //       scale: [scale * 0.5, scale * 0.5],
  //       outline: true,
  //     }
  //   );

  //   player.bubbleText[1] += 2;

  //   if (player.bubbleText[1] >= 350) {
  //     player.bubbleText = null;
  //   }
  // }
});

//bone attach

let attachData = [];
attachData[0] = ["prop_mp_drug_package", 60309, 0.2, 0.1, 0.28, 0, 100, -40]; // druglab

for (let i = 0; i <= 4; i++) {
  mp.events.addDataHandler("bone_attach" + i, function (entity, value) {
    if (entity != localPlayer.vehicle) {
      mp.gui.chat.push("DATA HANDLER BOYS" + entity + value);
      if (value != null) attachToBone(entity, i, value);
      else detachFromBone(entity, i);
    }
  });
}

mp.events.add("entityStreamIn", (entity) => {
  if (entity.type == "player") {
    var id = null;
    for (let i = 0; i <= 4; i++) {
      id = entity.getVariable("bone_attach" + i);
      if (id != null) {
        attachToBone(entity, i, id);
      }
    }
  }
});

mp.events.add("entityStreamOut", (entity) => {
  if (entity.type == "player") {
    for (let i = 0; i <= 4; i++) {
      if (entity["bone_attach_object" + i] != null) detachFromBone(entity, i);
    }
  }
});

function attachToBone(player, slot, id) {
  if (!mp.players.exists(player) || attachData[id] == null) return;

  if (player["bone_attach_object" + slot] != null)
    player["bone_attach_object" + slot].destroy();

  player["bone_attach_object" + slot] = mp.objects.new(
    mp.game.joaat(attachData[id][0]),
    player.position
  );

  player["bone_attach_object" + slot].attachTo(
    player.handle,
    player.getBoneIndex(attachData[id][1]),
    attachData[id][2],
    attachData[id][3],
    attachData[id][4],
    attachData[id][5],
    attachData[id][6],
    attachData[id][7],
    false,
    false,
    false,
    false,
    2,
    true
  );
}

function detachFromBone(player, slot) {
  if (!mp.players.exists(player)) return;

  if (player["bone_attach_object" + slot] != null) {
    player["bone_attach_object" + slot].destroy();
    player["bone_attach_object" + slot] = null;
  }
}

// function checkMovement() {
//   localPlayer.clearTasks();
// }

// mp.keys.bind(0x57 || 0x41 || 0x53 || 0x44 || 0xa0, false, function () {
//   if (localPlayer.isReloading()) mp.events.callRemote("playerMoving");
//   // localPlayer.clearTasks();
// });

mp.keys.bind(0x52, false, function () {
  // mp.game.invoke("0x62D2916F56B9CD2D", localPlayer.handle, true);
  if (localPlayer.isReloading()) {
    // localPlayer.clearTasks();
    return false;
  }
  localPlayer.taskReloadWeapon(true);
  mp.gui.chat.push(`${mp.players.local.handle}`);
  mp.gui.chat.push("R key is pressed.");
});

// mp.events.add("loadModel", (name) => {
//   mp.game.streaming.requestModel(mp.game.joaat(name));
//   // mp.objects.new(
//   //   mp.game.joaat(name),s
//   //   new mp.Vector3(
//   //     player.position.x + 1.2,
//   //     player.position.y,
//   //     player.position.z
//   //   ),
//   //   {}
//   // );
// });

// mp.events.add("playerCommand", (command) => {
//   const args = command.split(/[ ]+/);
//   const commandName = args[0];

//   args.shift();

//   if (commandName == "object") {
//     mp.game.streaming.requestModel(mp.game.joaat(args[0]));

//     mp.objects.new(mp.game.joaat(args[0]), localPlayer.position, {});
//   }
// });

// mp.events.add("playerCommand", (command) => {
//   const args = command.split(/[ ]+/);
//   const commandName = args[0];

//   args.shift();

//   if (commandName == "object") {
//     mp.objects.new(mp.game.joaat(args[0]), localPlayer.position, {});
//   }
// });
