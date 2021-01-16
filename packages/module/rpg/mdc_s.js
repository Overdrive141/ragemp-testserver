let date = new Date();
let hours = ("0" + (date.getUTCHours() + 1)).slice(-2);
let minutes = ("0" + (date.getUTCMinutes() + 1)).slice(-2);
let time = hours + ":" + minutes;

mp.events.add("server:mdc:fetchVehicleData", (player, search) => {
  gm.mysql.connection.query(
    // `SELECT owner, name, numberPlate FROM vehicles WHERE owner LIKE '%${search}%' OR numberPlate LIKE '%${search}%'`,
    // [search, search],
    `SELECT owner, name, numberPlate FROM vehicles WHERE owner = ? OR numberPlate = ?`,
    [search, search],
    function (err, data) {
      if (err) console.log(err);
      if (!mp.players.exists(player)) return false;
      player.call("client:mdc:returnVehicleData", [JSON.stringify(data)]);
    }
  );
});

mp.events.add("server:mdc:fetchPlayerData", (player, search) => {
  gm.mysql.connection.query(
    `SELECT id, name FROM users where id = ? OR name = ?`,
    [search, search],
    function (err, data) {
      console.log(JSON.stringify(data));
      if (err) console.log(err);
      if (!mp.players.exists(player)) return false;
      player.call("client:mdc:returnPlayerData", [JSON.stringify(data)]);
    }
  );
});

mp.events.add("server:mdc:fetchCharges", (player, search, lastID) => {
  let query = "";
  let queryVars = null;

  if (lastID) {
    query =
      "SELECT id, officer, suspect, charge_time, crime, punishment, amount FROM `mdc_charges` WHERE `suspect` = ? AND `id` < ? ORDER BY `charge_time` DESC LIMIT 30";
    queryVars = [search, lastID];
  } else {
    query =
      "SELECT id, officer, suspect, charge_time, crime, punishment, amount FROM `mdc_charges` WHERE `suspect` = ? ORDER BY `charge_time` DESC LIMIT 30";
    queryVars = [search];
  }

  gm.mysql.connection.query(query, queryVars, function (err2, data) {
    console.log(JSON.stringify(data));
    if (!mp.players.exists(player)) return false;
    if (err2) {
      // gm.core.show(player, "alert-red", "MDC Error #3");
      console.log(err2);
      return false;
    }

    let newLastID = 0;
    if (data.length > 0) newLastID = data[data.length - 1].id;

    if (lastID == 0 && newLastID == 0)
      player.call("client:mdc:displayCharges", [
        null,
        null,
        "No charges found.",
      ]);
    else
      player.call("client:mdc:displayCharges", [
        JSON.stringify(data),
        newLastID,
        null,
      ]);
  });
});

mp.events.add(
  "server:mdc:addCharges",
  (player, suspect, crime, punishment, amount) => {
    let officer = player.name;
    gm.mysql.connection.query(
      "INSERT INTO mdc_charges (officer, suspect, crime, punishment, amount, charge_time) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP())",
      [officer, suspect, crime, punishment, amount],
      function (err2, inserted) {
        if (!mp.players.exists(player)) return true;
        if (err2) {
          // gm.core.show(player, "alert-red", "MDC Error #1");
          console.log(err2);
          return false;
        }

        mp.events.call("server:mdc:fetchCharges", player, suspect, 0);

        return true;
      }
    );
  }
);

mp.events.add("server:mdc:deleteChargeRecord", (player, id) => {
  gm.mysql.connection.query(
    "DELETE FROM mdc_charges WHERE id = ?",
    [id],
    function (err2, result) {
      if (!mp.players.exists(player)) return false;

      player.dbDelay = null;

      if (err2) {
        // gm.core.showAlert(player, "alert-red", "MDC Error #2!");
        console.log(err2);
        return true;
      }

      // if (result.affectedRows > 0) {
      //   var amount = null;
      //   if (data[0].daysLeft > 0) {
      //     amount = parseInt(data[0].amount * 0.98);
      //     player.notify(
      //       "You closed the deposit early and received ~g~$" + amount
      //     );
      //   } else {
      //     amount = data[0].total;
      //     player.notify("You closed the deposit and received ~g~$" + amount);
      //   }

      //   player.bankMoney += amount;
      //   gm.core.savePlayerVariable(player, "bankMoney");
      //   player.call("c:bank:deleteDeposit", [id, player.bankMoney]);
      // } else {
      //   gm.core.showAlert(player, "alert-red", "Error #3!");
      // }
    }
  );
});

// gm.mysql.connection.query(
//   "INSERT INTO bank_deposits (sqlid, amount, total, days, daysLeft, date) VALUES (?, ?, ?, ?, ?, NOW())",
//   [player.sqlID, amount, total, days, days],
//   function (err2, inserted) {
//     if (!mp.players.exists(player)) return true;

//     if (err2) {
//       gm.core.showAlert(
//         player,
//         "alert-red",
//         "An error has occurred, contact admins!"
//       );
//       console.log(err2);
//       return false;
//     }

//     player.call("c:bank:addDeposit", [
//       player.bankMoney,
//       JSON.stringify({
//         id: inserted.insertId,
//         amount: amount,
//         days: days,
//         daysLeft: days,
//         total: total,
//       }),
//     ]);

//     return true;
//   }
// );

// module.exports.addEmergencyCall = function (player, msg) {
//   let date = new Date();
//   let hours = ("0" + (date.getUTCHours() + 1)).slice(-2);
//   let minutes = ("0" + (date.getUTCMinutes() + 1)).slice(-2);
//   let time = hours + ":" + minutes;

//   eID = ++eID;
//   emergencyCalls.push({
//     id: eID,
//     name: player.name,
//     //type: POLICE,
//     message: msg,
//     posX: player.position.x,
//     posY: player.position.y,
//     posZ: player.position.z,
//     timeCalled: time,
//   });
// };

let emergencyCalls = [];
let eID = 0;

mp.events.add("server:mdc:saveEmergencyCall"),
  (player, msg) => {
    eID = ++eID;
    emergencyCalls.push({
      id: eID,
      name: player.name,
      type: POLICE,
      msg,
      posX: player.position.x,
      posY: player.position.y,
      posZ: player.position.z,
      timeCalled: time,
    });
  };

// mp.events.addCommand({
//     call: (player, message) => {
//       emergencyCalls.push({
//         name: "Lin",
//         //player.name,
//         //type:
//         message,
//         posX: player.position.x,
//         posY: player.position.y,
//         posZ: player.position.z,
//       });
//     },
//   });

//New
mp.events.add("server:mdc:startMdc", (player) => {
  if (!mp.players.exists(player)) return false;
  // Dying
  // Faction Members Only
  // On Duty Only
  // Rank 3+ Only
  // if(player.getVariable('faction') == POLICE_ID && player.getVariable('isOnFactionDuty'))
  // {
  //   if(player.rank > 2)
  //   {
  //     player.call("c:mdc:showInfoWindow", [
  //       JSON.stringify(emergencyCalls),
  //       "LinwoodHancock", //New
  //     ]);
  //   }
  // }
  player.call("c:mdc:showInfoWindow", [
    JSON.stringify(emergencyCalls),
    "LinwoodHancock", //New
  ]);
});

mp.events.addCommand("mdc", (player) => {
  if (!mp.players.exists(player)) return false;

  // player.call("client:mdc:resultsCallList", [JSON.stringify(emergencyCalls)]);
  player.call("c:mdc:showInfoWindow", [
    JSON.stringify(emergencyCalls),
    "LinwoodHancock", //New
  ]);
});

mp.events.addCommand({
  call: (player, message) => {
    eID = ++eID;
    emergencyCalls.push({
      id: eID,
      name: "Lin",
      //player.name,
      //type:
      message,
      posX: player.position.x,
      posY: player.position.y,
      posZ: player.position.z,
      timeCalled: time,
    });
  },
});

mp.events.add("server:mdc:deleteCallRecord", (player, id) => {
  if (!mp.players.exists(player)) return false;
  emergencyCalls.splice(
    emergencyCalls.findIndex((e) => e.id === id),
    1
  );
  console.log(JSON.stringify(emergencyCalls));
  // player.call("c:mdc:showInfoWindow", [JSON.stringify(emergencyCalls)]);
});

mp.events.add("server:mdc:fetchCallList", (player) => {
  if (!mp.players.exists(player)) return false;
  //   if (emergencyCalls.length > 0) {
  // for (e in emergencyCalls) {
  //   player.outputChatBox(
  //     emergencyCalls[e].name +
  //       " " +
  //       emergencyCalls[e].message +
  //       " " +
  //       emergencyCalls[e].posX +
  //       " " +
  //       emergencyCalls[e].posY +
  //       " " +
  //       emergencyCalls[e].posZ +
  //       " " +
  //       emergencyCalls[e].timeCalled
  //   );
  // }
  console.log(JSON.stringify(emergencyCalls));
  player.call("client:mdc:resultsCallList", [JSON.stringify(emergencyCalls)]);
  //   }
});

mp.events.addCommand("911", (player) => {
  // emergencyCalls.push({ name: "Lin", type: "PD", message: "Stoned" });
  for (e in emergencyCalls) {
    player.outputChatBox(
      emergencyCalls[e].name +
        " " +
        emergencyCalls[e].message +
        " " +
        emergencyCalls[e].posX +
        " " +
        emergencyCalls[e].posY +
        " " +
        emergencyCalls[e].posZ +
        " " +
        emergencyCalls[e].timeCalled
    );
  }
});

// mp.players.forEach((pl) => {

//     // if(pl.getVariable("faction") == POLICE_ID && pl.getVariable("isOnFactionDuty") == true)
//     // {
//         pl.call("client:utils:createTempBlip", [
//             "service911"+player.sqlID,
//             "911",
//             162, 6, 1.0, false,
//             player.position.x,
//             player.position.y,
//             player.position.z
//         ]);

//         pl.outputChatBox(!{#abcdef}[911] Check your boy));
//     // }
// })
