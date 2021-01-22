mp.world.blackout = {
    _enabled: false,

    get enabled() {
        return this._enabled;
    },

    set enabled(newState) {
        this._enabled = newState;
        mp.players.call("SetBlackoutState", [this._enabled]);
    }
};

mp.events.add("playerReady", (player) => {
    player.call("SetBlackoutState", [mp.world.blackout.enabled]);
});