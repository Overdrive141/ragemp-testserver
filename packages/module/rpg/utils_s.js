mp.Vector3.getDistanceBetweenPoints3D = function (v1, v2) {
  return Math.abs(
    Math.sqrt(
      Math.pow(v2.x - v1.x, 2) +
        Math.pow(v2.y - v1.y, 2) +
        Math.pow(v2.z - v1.z, 2)
    )
  );
}; // function calculating the distance between two points in the space X; Y; Z;

mp.events.addCommand("testCore", (player) => {
  player.playAnimation("amb@medic@standing@kneel@base", "base", 1, 1);
  gm.core.showTimeoutBox(player, "alert-yellow", "Testing", 10);
});

// Admin Commands
mp.events.addCommand({
  altaccountip: (player, _, target) => {
    // if (!player.loggedIn || player.admin < 4 || !player.loggedInAdmin)
    //   return true;
    if (!target)
      return player.outputChatBox("Use: /altaccount [Firstname_Lastname]");

    // let regIp = 0;

    //if(source === 'ip')
    //gm.mysql.connection.query('SELECT `name` FROM `users` WHERE regip = ? OR regSocial = ? OR lastSocial = ? ')
    gm.mysql.connection.query(
      "SELECT `regip` FROM `users` WHERE name = ?",
      [target],
      function (err, data) {
        if (!mp.players.exists(player)) return false;
        if (err) {
          console.log(err);
          return false;
        }
        if (data.length > 0) {
          let regIp = data[0].regip;
          gm.mysql.connection.query(
            "SELECT `name` FROM `users` WHERE regip = ?",
            [regIp],
            function (err2, data2) {
              if (err2) {
                console.log(err2);
                return false;
              }
              console.log(data2);
              if (data.length > 0)
                for (let i in data2)
                  player.outputChatBox(`!{green}${data2[i].name}`);
            }
          );
        } else
          return player.outputChatBox(
            `!{green}No player exists with that name.`
          );
        // } return data[0].regip;
      }
    );
  },
  altaccount: (player, _, target) => {
    // if (!player.loggedIn || player.admin < 4 || !player.loggedInAdmin)
    //   return true;
    if (!target)
      return player.outputChatBox("Use: /altaccount [Firstname_Lastname]");

    gm.mysql.connection.query(
      "SELECT `regSocial`, `lastSocial` FROM `users` WHERE name = ?",
      [target],
      function (err, data) {
        if (!mp.players.exists(player)) return false;
        if (err) {
          console.log(err);
          return false;
        }
        if (data.length > 0) {
          let regSocial = data[0].regSocial;
          let lastSocial = data[0].lastSocial;
          console.log(regSocial + lastSocial);
          var names = [];
          if (regSocial !== lastSocial) {
            gm.mysql.connection.query(
              "SELECT `name` FROM `users` WHERE lastSocial = ? OR regSocial = ?",
              [lastSocial, lastSocial],
              function (err2, data2) {
                if (err2) {
                  console.log(err2);
                  return false;
                }
                console.log(data2);
                for (let i in data2) names.push(data2[i].name);
              }
            );
          }
          gm.mysql.connection.query(
            "SELECT `name` FROM `users` WHERE regSocial = ? OR lastSocial = ?",
            [regSocial, regSocial],
            function (err2, data2) {
              if (err2) {
                console.log(err2);
                return false;
              }
              console.log(data2);
              for (let i in data2) {
                if (!names.includes(data2[i].name)) names.push(data2[i].name);
              }
              player.outputChatBox(`!{green}Other accounts: ${[...names]}`);
            }
          );
        } else
          return player.outputChatBox(
            `!{green}No player exists with that name.`
          );
      }
    );
  },
  altaccountserial: (player, _, target) => {
    // if (!player.loggedIn || player.admin < 4 || !player.loggedInAdmin)
    //   return true;
    if (!target)
      return player.outputChatBox("Use: /altaccount [Firstname_Lastname]");

    gm.mysql.connection.query(
      "SELECT `regSerial`, `lastSerial` FROM `users` WHERE name = ?",
      [target],
      function (err, data) {
        if (!mp.players.exists(player)) return false;
        if (err) {
          console.log(err);
          return false;
        }
        if (data.length > 0) {
          let regSerial = data[0].regSerial;
          let lastSerial = data[0].lastSerial;
          console.log(regSerial + lastSerial);
          var names = [];
          if (regSerial !== lastSerial) {
            gm.mysql.connection.query(
              "SELECT `name` FROM `users` WHERE lastSerial = ? OR regSerial = ?",
              [lastSerial, lastSerial],
              function (err2, data2) {
                if (err2) {
                  console.log(err2);
                  return false;
                }
                console.log(data2);
                for (let i in data2) names.push(data2[i].name);
              }
            );
          }
          gm.mysql.connection.query(
            "SELECT `name` FROM `users` WHERE regSerial = ? OR lastSerial = ?",
            [regSerial, regSerial],
            function (err2, data2) {
              if (err2) {
                console.log(err2);
                return false;
              }
              console.log(data2);
              for (let i in data2) {
                if (!names.includes(data2[i].name)) names.push(data2[i].name);
              }
              player.outputChatBox(`!{green}Other accounts: ${[...names]}`);
            }
          );
        } else
          return player.outputChatBox(
            `!{green}No player exists with that name.`
          );
      }
    );
  },
});

mp.events.addCommand("afrank", (player, _, target) => {
  // if (!player.loggedIn || player.admin < 5 || !player.loggedInAdmin)
  //   return true;
  if (!target)
    return player.outputChatBox("Use: /altaccount [Firstname_Lastname]");

  gm.mysql.connection.query(
    "SELECT `fRank`, `rank` FROM `users` WHERE name = ?",
    [target],
    function (err, data) {
      if (err) console.log(err);
      if (data.length > 0) {
        let fRank = data[0].fRank;
        let rank = data[0].rank;
        player.outputChatBox(`Faction Rank: ${rank} | Family Rank: ${fRank}`);
      } else
        player.outputChatBox(
          `!{red}No player exists with that name or player has no rank.`
        );
    }
  );
});

mp.events.addCommand("pos", (player, _, x, y, z) => {
  // if (!x | !y | !z) return player.outputChatBox("/pos x y z");
  // console.log(x + y + z);
  player.position = new mp.Vector3(
    1343.47216796875,
    4317.1806640625,
    37.99006652832031
  );
});

mp.events.addCommand("twitter", (player, text) => {
  if (!player.loggedIn) return true;

  // if(player.getVariable("muteTime") > 0)
  // {
  //     gm.core.showAlert(player, 'alert-red', 'Your chat is disabled. Remaining time: '+player.getVariable("muteTime")+' min');
  //     return true;
  // }

  // if(player.chatTwtr == 1)
  // {
  //     player.outputChatBox(`!{red}This chat is for socialising with other players. Turn it on in tablet settings`);
  //     return true;
  // }

  // if(player.getVariable("level") < 4)
  // {
  //     player.outputChatBox("This chat will be available from level 4");
  //     return true;
  // }

  let timeNow = Date.now();

  if (player.chatTwtrdelay > timeNow) {
    player.outputChatBox(
      `You can write the next message in: ${parseInt(
        (player.chatTwtrdelay - timeNow) / 1000
      )} sec`
    );
    return true;
  }

  if (!text) {
    player.outputChatBox("Use: /twitter [text]");
    return true;
  }

  if (text.length > 160) {
    player.outputChatBox("The text is too long");
    return true;
  }

  let upper_letters = 0;

  for (let i = 0; i < text.length; i++) {
    let chr = text[i];

    if ((chr >= "A" && chr <= "Z") || (chr >= "А" && chr <= "Я"))
      upper_letters++;
  }

  if (upper_letters >= text.length / 3) {
    player.outputChatBox(
      "Do not use too much capital letters when using the Twitter Chat."
    );
    return true;
  }

  player.chatTwtrdelay = timeNow + 60 * 1000;

  text = text.replace(/{/g, "(");
  text = text.replace(/}/g, ")");

  let message = `!{#00acee}[Twitter] ${player.name}[${player.sqlID}]: ${text}`;

  mp.players.forEach((pl) => {
    if (pl.loggedIn && pl.chatTwtr == 0) pl.outputChatBox(message);
  });

  return true;
});

mp.events.addCommand("ablackout", (player) => {
  mp.world.blackout.enabled = !mp.world.blackout.enabled;
  player.outputChatBox(
    `Blackout ${mp.world.blackout.enabled ? `enabled` : `disabled`}.`
  );
});
