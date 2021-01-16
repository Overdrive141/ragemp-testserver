mp.events.add(
    {
        "TOGGLE_MUTE": (toggle) => {
            ToggleMute(toggle);
        }
    });

function ToggleMute(toggle) {
    mp.gui.chat.activate(toggle);
}