const MaxRange = 20.0;
const VoiceVol = 1.0;
const VoiceChatKey = 0x43; // С

var DoubleClickReload = 0;
var VoiceReloadDelay = 0;

const MaxRange = 20.0;
const VoiceVol = 1.0;
const VoiceChatKey = 0x43; // С

var DoubleClickReload = 0;
var VoiceReloadDelay = 0;

// Hud player
mp.events.add("hudSetMicActive", (toggle) => {
  let radio = false;

  if (localPlayer.getVariable("voiceChannel")) radio = true;

  mp.gui.cef.execute(`hud.micActive(${toggle}, ${radio});`);
});

mp.events.add("_playerStopTalking", (player) => {
  if (mp.game.tabletCurrentApp == "voip") {
    let channel = localPlayer.getVariable("voiceChannel");

    if (channel && player.getVariable("voiceChannel") == channel) {
      mp.gui.tablet.execute(
        `voip.setUserTalking("${player.getVariable("sqlID")}", false)`
      );
    }
  }
});

mp.keys.bind(VoiceChatKey, false, function () {
  mp.voiceChat.muted = true;
  mp.events.call("hudSetMicActive", false);
  mp.events.call("_playerStopTalking", localPlayer);
});

mp.keys.bind(VoiceChatKey, true, function () {
  if (mp.gui.cursor.visible != false && ENABLE_VOICE_WITH_CURSOR == false)
    return;

  let time = Date.now();

  if (DoubleClickReload > time && VoiceReloadDelay < time) {
    VoiceReloadDelay = time + 60000;

    DoubleClickReload = 0;

    mp.voiceChat.cleanupAndReload(true, true, true);

    showAlert(
      "alert-blue",
      "Voice chat has been restarted by double-clicking and will be available in about a minute!"
    );
    return;
  }

  DoubleClickReload = time + 250;

  if (localPlayer.getVariable("muteTime") > 0)
    return showAlert(
      "alert-red",
      "Your voice chat is disabled. Time left: " +
        localPlayer.getVariable("muteTime") +
        " min"
    );

  mp.voiceChat.muted = false;
  mp.events.call(
    "hudSetMicActive",
    true,
    localPlayer.getVariable("voiceChannel")
  );
  mp.events.call("_playerStartTalking", localPlayer);
});

setInterval(function () {
  if (localPlayer.getVariable("muteTime") > 0) {
    mp.events.callRemote("reduceMuteTime");
  }
}, 60000);

mp.events.addDataHandler("voiceChannel", function (entity, value) {
  if (entity != localPlayer) {
    let voiceChannel = localPlayer.getVariable("voiceChannel");

    if (voiceChannel && voiceChannel == value) {
      if (!entity.isListening) g_voiceMgr.add(entity);
    }
  } else {
    if (value) {
      mp.players.forEach((pl) => {
        if (pl != localPlayer && pl.getVariable("voiceChannel") == value) {
          if (!pl.isListening) g_voiceMgr.add(pl);
        }
      });
    } else {
      mp.gui.cef.execute(`hud.clearSpeakers()`);
    }
  }
});

let g_voiceMgr = {
  listeners: [],

  add: function (player) {
    this.listeners.push(player);

    player.isListening = true;

    mp.events.callRemote("add_voice_listener", player);

    player.voiceVolume = VoiceVol;
  },

  remove: function (player, notify) {
    let idx = this.listeners.indexOf(player);

    if (idx !== -1) this.listeners.splice(idx, 1);

    player.isListening = false;

    if (notify) mp.events.callRemote("remove_voice_listener", player);

    if (player.isVoiceActive) mp.events.call("_playerStopTalking", player);
  },
};

mp.events.add("playerQuit", (player) => {
  if (player.isListening) {
    g_voiceMgr.remove(player, false);
  }
});

setInterval(() => {
  let localPos = localPlayer.position;

  mp.players.forEachInStreamRange((player) => {
    if (player != localPlayer) {
      if (!player.isListening) {
        const playerPos = player.position;
        let dist = mp.game.system.vdist(
          playerPos.x,
          playerPos.y,
          playerPos.z,
          localPos.x,
          localPos.y,
          localPos.z
        );

        if (dist <= MaxRange) {
          g_voiceMgr.add(player);
        }
      }
    }
  });

  let voiceChannel = localPlayer.getVariable("voiceChannel");

  g_voiceMgr.listeners.forEach((player) => {
    if (voiceChannel && voiceChannel == player.getVariable("voiceChannel")) {
      player.voiceVolume = VoiceVol;
      player.voice3d = false;
    } else {
      if (player.handle !== 0) {
        const playerPos = player.position;
        let dist = mp.game.system.vdist(
          playerPos.x,
          playerPos.y,
          playerPos.z,
          localPos.x,
          localPos.y,
          localPos.z
        );

        if (dist > MaxRange) {
          g_voiceMgr.remove(player, true);
        } else {
          player.voiceVolume = (1 - dist / MaxRange) * VoiceVol;
          player.voice3d = true;
        }
      } else {
        g_voiceMgr.remove(player, true);
      }
    }

    if (player.isVoiceActive != player.isVoiceActiveLast) {
      if (player.isVoiceActive) mp.events.call("_playerStartTalking", player);
      else mp.events.call("_playerStopTalking", player);
    }

    player.isVoiceActiveLast = player.isVoiceActive;
  });
}, 350);

mp.game.streaming.requestAnimDict("mp_facial");
mp.game.streaming.requestAnimDict("facials@gen_male@variations@normal");

mp.events.add("_playerStartTalking", (player) => {
  if (player.handle) player.playFacialAnim("mic_chatter", "mp_facial");

  let voice = localPlayer.getVariable("voiceChannel");

  if (voice && player.getVariable("voiceChannel") == voice) {
    mp.gui.cef.execute(
      `hud.showSpeaker(${player.getVariable("sqlID")}, "${player.name}")`
    );
  }
});

mp.events.add("_playerStopTalking", (player) => {
  if (player.handle)
    player.playFacialAnim(
      "mood_normal_1",
      "facials@gen_male@variations@normal"
    );

  let voice = localPlayer.getVariable("voiceChannel");

  if (voice && player.getVariable("voiceChannel") == voice) {
    mp.gui.cef.execute(`hud.hideSpeaker(${player.getVariable("sqlID")})`);
  }
});
