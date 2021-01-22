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

// // Jail System
// mp.events.add("playerDeath", (player, reason, killer) => {

// 	if(debugEnabled) debug("factions_s.js playerDeath");

// 	if(!player.loggedIn) return true;
// 	if(player.derbyID != null || player.isOnEvent) return true;

// 	// Punishment for murder
// 	if(killer && killer != player)
// 	{

// 		if(killer.vehicle && killer.seat == -1)
// 		{
// 			gm.utils.sendAdminMessage(`!{dd7c3c}[ALERT] ${killer.name} probably VDM, check /sp ${killer.sqlID}`);
// 		}

// 		if((killer.getVariable("faction") == POLICE_ID || killer.getVariable("faction") == ARMY_ID) && killer.getVariable("isOnFactionDuty") == true) // If ONDUTY policeman or army killed a player
// 		{
// 			if(player.getVariable("wantedTime") <= 0) //If the player did not have a wanted list
// 			{
// 				// gm.core.givePlayerLawAbiding(killer, -KILL_PLAYER_LAWABIDING_REDUCE_POLICE, "killing an innocent"); // give a warning

// 				if(player.getVariable("level") < 9)
// 				{
// 					player.outputChatBox(`!{yellow}${killer.name}[${killer.sqlID}] !{white}killed you`);
// 				}
// 			}
// 		}
// 		else // If the killer is not a cop
// 		{
// 			if(killer.inOnCapture != true) // If the killer is not on the capture, then we will issue a wanted list
// 			{
// 				gm.core.addPlayerWantedTime(killer, KILL_PLAYER_WANTED_TIME, KILL_PLAYER_LAWABIDING_REDUCE, "murder"); // Needs to be removed MAYBE

// 				if(player.getVariable("level") < 9)
// 				{
// 					player.outputChatBox(`!{yellow}${killer.name}[${killer.sqlID}] !{white}killed you`);
// 				}
// 			}
// 		}

// 		var killerFaction = killer.getVariable("faction"); // Faction of Killer
// 		if(killerFaction > 0 && killer.lawAbiding < LAWABIDING_THRESHOLD_UNINVITE)
// 		{
// 			uninvitePlayerFromFaction(killer);
// 			addPlayerToFactionBlacklist(killer, killerFaction, 5, "server");
// 			killer.notify("You are fired due to low law-abiding");

// 			gm.mysql.connection.query("INSERT INTO `log_factions` (faction, action, var1, date) VALUES (?, 4, ?, NOW())", [killerFaction, killer.name], function(e) { if(e) console.log(e); });
// 		}
// 	}

// 	// Is it necessary to imprison the dead
// 	if(player.getVariable("wantedTime") > 0 && player.inOnCapture != true && player.getVariable("faction") != POLICE_ID) // ADD ARMY HERE MAYBE (LIN) - && player.getVariable('faction') != ARMY_ID
// 	{
// 		let put_in_jail = false;

// 		mp.players.forEachInRange(player.position, 30.0, [player.dimension], (other) => { // Test the Range. Maybe should be 10.

// 			if(other.getVariable("faction") == POLICE_ID && other.getVariable("passiveMode") != true && other.getVariable("isOnFactionDuty") == true) // If other is Police and On Duty then put the boy in jail
// 			{
// 				put_in_jail = true;
// 				return ;
// 			}
// 		});

// 		if(put_in_jail == true)
// 		{
// 			calculateJailTime(player);
// 			gm.core.givePlayerLawAbiding(player, -LAWABIDING_REDUCE_ON_DEATH, "disobedience");
// 		}
// 	}

// 	if(player.respawnTimeout) clearTimeout(player.respawnTimeout);

// 	if(player.getVariable("jailTime") > 0) // This is the Faulty Boy (LIN)
// 	{
// 		player.respawnTimeout = setTimeout(module.exports.spawnPlayerToJail, 5000, player);
// 		return true;
// 	}

// 	if(player.hospitalRestore*1000 > Date.now() || (player.aquanautVeh != null && player.vehicle == player.aquanautVeh))
// 	{
// 		player.respawnTimeout = setTimeout(module.exports.spawnPlayerToHospital, 5000, player);
// 		return true;
// 	}

// 	if(player.inOnCapture)
// 	{
// 		player.respawnTimeout = setTimeout(module.exports.spawnPlayerToHospital, 5000, player);
// 		return true;
// 	}

// 	player.respawnTimeout = setTimeout(spawnPlayerToHospitalTimer, 2 * 60 * 1000, player);
// 	player.call("onMakeMedicRequest", [module.exports.getMedicPrice(player)]);

// 	return true;
// });

// mp.events.add("playerQuit", (player) => {

// 	if(debugEnabled) debug("playerQuit factions");

// 	if(player.respawnTimeout) clearTimeout(player.respawnTimeout);

// 	if(player.getVariable("wantedTime") > 0 || player.following == true) // Change it to && following == true; and Maybe remove wantedTime idk
// 	{
// 		let stop_function = false;
// 		mp.players.forEach((other) => {

// 			if(!stop_function)
// 			{
// 				if(other.getVariable("faction") == POLICE_ID)
// 				{
// 					let meters = mp.Vector3.getDistanceBetweenPoints3D(other.position, player.position);

// 					if(meters < 30)
// 					{
// 						stop_function = true;
// 						calculateJailTime(player);
// 						mp.players.broadcast(`!{b8a2ff}Server: ${player.name} goes to jail due to leaving during arrest`);
// 						return true;
// 					}
// 				}
// 			}
// 		});
// 	}

// 	if(player.factionVehicle != null)
// 	{
// 		if(mp.vehicles.exists(player.factionVehicle))
// 		{
// 			player.factionVehicle.destroy();
// 			player.factionVehicle = null;
// 		}
// 	}

// 	return true;
// });
