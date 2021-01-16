let JAIL_SPAWN = new mp.Vector3(1737, 2550, 45.56);

mp.events.addCommand("arrest", (player, _, destPlayer, time) => {
  //if(debugEnabled) debug("command arrest");

  if (!player.loggedIn) return true;
  //if(player.getVariable("faction") != POLICE_ID) return true;

  //if(player.rank == 0) return gm.core.showAlert(player, 'alert-red', 'Not available until the leader raise you to rank 1, or wait for an automatic raise in 3 days!');

  if (
    mp.Vector3.getDistanceBetweenPoints3D(
      player.position,
      new mp.Vector3(1690.6998291015625, 2591.274169921875, 45.91438674926758)
    ) > 5
  )
    return true;

  if (!destPlayer)
    return player.outputChatBox(
      "Use: /arrest [player id/part of name] [time in minutes]"
    );

  destPlayer = findPlayer(destPlayer);

  if (!destPlayer) return player.outputChatBox(`!{red}Player not found`);
  if (!destPlayer.loggedIn)
    return player.outputChatBox(`!{red}The player has not logged in yet`);
  //if(destPlayer == player)     return player.outputChatBox(`!{red}You can't do it on yourself`);

  //NEW
  var time = parseInt(time);
  if (isNaN(time) || time < 1 || time > 90)
    return player.outputChatBox(
      "Use: /arrest [player id/part of name] [time 1-90]"
    );

  if (
    mp.Vector3.getDistanceBetweenPoints3D(
      player.position,
      destPlayer.position
    ) > 5
  )
    return player.outputChatBox(`!{red}The player is too far`);
  //if(destPlayer.getVariable("wantedTime") < 1 && destPlayer.following == false) return player.outputChatBox(`!{red}The player is not wanted`);
  //if(destPlayer.following == false) return player.outputChatBox(`!{red}The player is not in cuffs`);

  //gm.core.showAlert(player, 'alert-green', 'You put '+destPlayer.name+' in jail, $'+ARREST_REWARD+' added to your salary');
  //gm.core.givePayDayMoney(player, ARREST_REWARD);
  //addLogIncome("arrest", ARREST_REWARD);

  destPlayer.jailed = 1;
  destPlayer.setVariable("jailTime", time);
  //if(destPlayer.getVariable("wantedTime") != 0) destPlayer.setVariable("wantedTime", 0);

  spawnPlayerToJail(destPlayer);

  // Change to connection
  gm.mysql.connection.query(
    "UPDATE `users` SET `wantedTime` = 0, `jailed` = 1, `jailTime` = ? WHERE `id` = ?",
    [time, 4],
    function (err) {
      if (err) console.log(err);
    }
  );

  //calculateJailTime(destPlayer, false);
  //destPlayer.position = JAIL_SPAWN;
  //destPlayer.call("setFollowTo", [null]);

  return true;
});

spawnPlayerToJail = function (player) {
  if (!mp.players.exists(player)) return false;

  player.spawn(JAIL_SPAWN);
  //player.heading = JAIL_SPAWN_R;
  //player.dimension = player.jailed - 1;
  //player.respawnTimeout = null;

  return true;
};

findPlayer = function findPlayer(name) {
  let players = mp.players.toArray();
  for (let p in players) {
    if (players[p].name == name) {
      return players[p];
    }
  }
  return null;
};
