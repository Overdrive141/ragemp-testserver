mp.events.add("client:teleports:setPos", (x, y, z, h) => {
  mp.gui.chat.push("Called");
  mp.game.cam.doScreenFadeOut(350);

  BLOCK_CONTROLS = true;

  setTimeout(function () {
    localPlayer.position = new mp.Vector3(x, y, z);
    localPlayer.setHeading(h);

    mp.game.cam.doScreenFadeIn(350);

    mp.game.cam.setGameplayCamRelativeHeading(0.0);

    BLOCK_CONTROLS = false;
  }, 500);
});
