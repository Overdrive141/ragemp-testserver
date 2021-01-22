// Cancel RepairKit or Medkit
mp.events.add("c:utils:cancelBlockedControls", () => {
  if (BLOCK_CONTROLS || BLOCK_CONTROLS_CAR_MOVEMENT) {
    BLOCK_CONTROLS = false;
    BLOCK_CONTROLS_CAR_MOVEMENT = false;
  }
});

// Toggle Cursor
const F6Key = 0x75;
mp.keys.bind(F6Key, false, function () {
  if (mp.gui.cursor.visible) mp.gui.cursor.show(false, false);
  else mp.gui.cursor.show(true, true);
});
