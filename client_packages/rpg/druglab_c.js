const JOB_TO_STORAGE = 2;
const JOB_TO_TABLE = 3;
const JOB_PRODUCING = 4;

let jobMarker = null;
let jobColshape = null;
let jobBlip = null;

mp.labels.new(
  "~HUD_COLOUR_VIDEO_EDITOR_AUDIO~Drug Production",
  new mp.Vector3(1009.359375, -3201.52392578125, -38.99312973022461 + 0.5),
  { los: true, font: 0, drawDistance: 15 }
); // z+0.5

mp.markers.new(
  1,
  new mp.Vector3(1009.359375, -3201.52392578125, -38.99312973022461 - 1.0),
  1,
  { color: [134, 64, 108, 255] }
); //z-1.0
let startJobColshape = mp.colshapes.newSphere(
  1009.359375,
  -3201.52392578125,
  -38.99312973022461,
  2.0
);

let stopJobColshape = mp.colshapes.newSphere(
  1009.359375,
  -3201.52392578125,
  -38.99312973022461,
  150.0
);

mp.blips.new(
  51,
  new mp.Vector3(1454.817626953125, -1652.2652587890625, 66.99488830566406),
  { name: "Drug Lab", color: 4, shortRange: true, scale: 1.0 }
);

mp.game.interior.enableInteriorProp(247041, "meth_lab_empty");
mp.game.interior.refreshInterior(247041);

mp.objects.new(
  mp.game.joaat("sm_prop_smug_crate_m_medical"),
  new mp.Vector3(999.5201416015625, -3200.031494140625, -40.19314193725586),
  { rotation: new mp.Vector3(0, 0, 90) }
);
mp.objects.new(
  mp.game.joaat("sm_prop_smug_crate_s_hazard"),
  new mp.Vector3(1016.4998779296875, -3194.452880859375, -39.508026123046875)
);
mp.objects.new(
  mp.game.joaat("v_med_flask"),
  new mp.Vector3(996.9227905273438, -3199.91015625, -39.452877044677734)
);
mp.objects.new(
  mp.game.joaat("v_med_flask"),
  new mp.Vector3(996.9529418945312, -3199.2998046875, -39.452877044677734)
);
mp.objects.new(
  mp.game.joaat("hei_prop_hei_drug_pack_02"),
  new mp.Vector3(996.9765625, -3201.02880859375, -39.452877044677734)
);
mp.objects.new(
  mp.game.joaat("hei_prop_hei_drug_pack_02"),
  new mp.Vector3(996.986328125, -3200.6767578125, -39.452877044677734)
);

mp.events.add("playerEnterColshape", (shape) => {
  if (localPlayer.vehicle != null) return;

  if (shape == startJobColshape) {
    switch (localPlayer.job) {
      case JOB_DRUGMAKER:
        mp.events.call("jobDrugmaker", JOB_STOP);
        break;

      case null:
        mp.events.call("jobDrugmaker", JOB_START);
        mp.gui.chat.push("case null jobDrugMaker, JOB START");
        break;

      default:
        mp.game.graphics.notify("~r~Finish your current work first");
        break;
    }
  } else if (shape == jobColshape) {
    mp.events.callRemote("jobDrugmaker", JOB_TO_STORAGE);
    //mp.gui.chat.push("playerEnterColshape else: jobDrugMaker JOB TO STORAGE");
  }
});

mp.events.add("playerExitColshape", (shape) => {
  if (shape == stopJobColshape) {
    if (localPlayer.job == JOB_DRUGMAKER) {
      mp.events.call("jobDrugmaker", JOB_STOP);
      //mp.gui.chat.push("playerExitColshape jobDrugMaker");
    }
  }
});

function destroyJobEntities() {
  if (jobMarker) {
    jobMarker.destroy();
    jobMarker = null;
  }

  if (jobColshape) {
    jobColshape.destroy();
    jobColshape = null;
  }

  if (jobBlip) {
    jobBlip.destroy();
    jobBlip = null;
  }
}

mp.events.add("jobDrugmaker", (stage, attr) => {
  mp.gui.chat.push("Triggered # 1");
  switch (stage) {
    case JOB_START:
      mp.gui.chat.push("Triggered # 3");
      if (localPlayer.job != JOB_DRUGMAKER) {
        mp.gui.chat.push("Triggered # 2");
        localPlayer.job = JOB_DRUGMAKER;
        destroyJobEntities();

        jobMarker = mp.markers.new(
          1,
          new mp.Vector3(
            1001.0001831054688,
            -3199.923095703125,
            -38.993133544921875 - 2
          ),
          2,
          { color: [130, 130, 255, 255] }
        ); //z-1.0
        jobColshape = mp.colshapes.newSphere(
          1001.0001831054688,
          -3199.923095703125,
          -38.993133544921875,
          2.0
        );
        jobBlip = mp.blips.new(
          1,
          new mp.Vector3(
            1001.0001831054688,
            -3199.923095703125,
            -38.993133544921875
          ),
          { color: 3 }
        );
      }

      BLOCK_CONTROLS_DURING_ANIMATION = false;

      break;
    case JOB_PRODUCING:
      let data = attr;

      BLOCK_CONTROLS_DURING_ANIMATION = true;
      localPlayer.setVelocity(0, 0, 0);

      localPlayer.position = new mp.Vector3(data[0], data[1], data[2]);
      localPlayer.setHeading(data[3]);

      break;
    case JOB_STOP:
      localPlayer.job = null;
      destroyJobEntities();
      //mp.events.callRemote("jobDrugmaker", JOB_STOP);
      mp.gui.chat.push("playerExitColshape jobDrugMaker");

      if (BLOCK_CONTROLS_DURING_ANIMATION)
        BLOCK_CONTROLS_DURING_ANIMATION = false;
      break;
  }
});

let drugsEffect = 0;

let reductionInterval = null;

const MAX_EFFECT = 10;

mp.events.add("addDrugsEffect", (val) => {
  drugsEffect += val;

  if (drugsEffect > MAX_EFFECT) {
    drugsEffect = MAX_EFFECT;
  }

  mp.game.player.setRunSprintMultiplierFor(1.0 + drugsEffect / 33);

  if (reductionInterval == null) {
    reductionInterval = setInterval(reductionIntervalFunction, 1000);
    mp.game.graphics.setTransitionTimecycleModifier("spectator5", 5.0);
  }
});

function reductionIntervalFunction() {
  if (drugsEffect > 0) {
    drugsEffect -= 0.0025;
    mp.game.player.setRunSprintMultiplierFor(1.0 + drugsEffect / 33);

    if (drugsEffect <= 0) {
      stopDrugsEffect();
    }
  }
}

function stopDrugsEffect() {
  drugsEffect = 0;

  if (reductionInterval != null) {
    clearInterval(reductionInterval);
    reductionInterval = null;
    mp.game.graphics.setTransitionTimecycleModifier("default", 5.0);
    mp.game.player.setRunSprintMultiplierFor(1.0);
  }
}

mp.events.add("playerDeath", (player) => {
  if (player == localPlayer) {
    stopDrugsEffect();
  }
});

// selling drugs
let ped = mp.peds.new(
  mp.game.joaat("g_m_y_mexgang_01"),
  new mp.Vector3(58.04389190673828, 3699.9765625, 39.75497817993164),
  321.5,
  0
);
mp.labels.new(
  "Roberto",
  new mp.Vector3(58.04389190673828, 3699.9765625, 39.75497817993164 + 1.1),
  { los: true, font: 0, drawDistance: 2.5 }
);
ped.randomAction = true;
