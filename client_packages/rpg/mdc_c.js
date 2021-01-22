const MDCKey = 0x73; // F4 Key

let mdcCoords = [
  [441.3470458984375, -978.683349609375, 30.689584732055664],
  [459.7095642089844, -989.540771484375, 24.91487693786621],
];

let = vehicle_has_mdc = [
  mp.game.joaat("police2"),
  mp.game.joaat("police3"),
  mp.game.joaat("polaventa"),
  mp.game.joaat("explorer2"),
];

for (var x = 0; x < mdcCoords.length; x++) {
  mp.labels.new(
    "Mobile Data Computer",
    new mp.Vector3(mdcCoords[x][0], mdcCoords[x][1], mdcCoords[x][2] + 0.5),
    { los: true, font: 0, drawDistance: 15 }
  );

  mp.markers.new(
    1,
    new mp.Vector3(mdcCoords[x][0], mdcCoords[x][1], mdcCoords[x][2] - 1.0),
    1.0,
    { color: [134, 64, 108, 255] }
  );

  let shape = mp.colshapes.newSphere(
    mdcCoords[x][0],
    mdcCoords[x][1],
    mdcCoords[x][2],
    1.0
  );
  shape.isInMdc = true;
}

mp.events.add("playerEnterColshape", (shape) => {
  if (shape.isInMdc) {
    mp.game.graphics.notify("Press ~g~[F4]~w~ to open the LSPD MDC");

    // mp.events.callRemote("server:mdc:startMdc");
  }
});

mp.events.add("playerExitColshape", (shape) => {
  if (shape.isInMdc) {
    mp.events.call("c:mdc:hideInfoWindow");
  }
});

mp.keys.bind(MDCKey, false, function () {
  let receptionDist = mp.Vector3.getDistanceBetweenPoints3D(
    localPlayer.position,
    new mp.Vector3(mdcCoords[0][0], mdcCoords[0][1], mdcCoords[0][2])
  );

  let cellsDist = mp.Vector3.getDistanceBetweenPoints3D(
    localPlayer.position,
    new mp.Vector3(mdcCoords[1][0], mdcCoords[1][1], mdcCoords[1][2])
  );

  if (
    // localPlayer.getVariable("faction") == POLICE_ID &&
    // localPlayer.getVariable("isOnFactionDuty") &&
    localPlayer.dimension == 0
  ) {
    if (receptionDist < 2.0 || cellsDist < 2.0) {
      if (!localPlayer.vehicle && !mp.gui.cursor.visible) {
        mp.events.callRemote("server:mdc:startMdc");
      }
    }

    if (
      localPlayer.vehicle &&
      vehicle_has_mdc.indexOf(localPlayer.vehicle.model) != -1
    ) {
      if (!mp.gui.cursor.visible) {
        mp.events.callRemote("server:mdc:startMdc");
      }
    }
  }
});

mp.events.add("playerEnterVehicle", (vehicle, seat) => {
  if (vehicle && seat == 0 && vehicle_has_mdc.indexOf(vehicle.model) != -1) {
    setTimeout(function () {
      mp.game.graphics.notify("Press ~g~[F4]~w~ to open the LSPD MDC");
    }, 3000);
  }
});

mp.events.add("c:mdc:showInfoWindow", (emergencyCalls, name) => {
  mp.game.graphics.transitionToBlurred(250);

  mp.gui.chat.activate(false);

  setTimeout(function () {
    mp.gui.cursor.show(true, true);
  }, 100);

  mp.game.audio.playSoundFrontend(
    -1,
    "Hack_Success",
    "DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS",
    true
  );

  mp.gui.cef.execute(`mdc.showPlName('${name}')`); //new

  let data = JSON.parse(emergencyCalls);

  if (data.length > 0) {
    for (var d in data) {
      mp.gui.cef.execute(
        `mdc.addCallRecords("${data[d].id}","${data[d].name}","${data[d].message}",
        "${data[d].posX}","${data[d].posY}","${data[d].posZ}",
        "${data[d].timeCalled}")
        `
      );
      mp.gui.cef.execute(`
      screen.hide("mdc_nocalls");
      screen.show("mdc-911-table");
      `);
    }
  } else {
    mp.gui.cef.execute(`
    screen.show("mdc_nocalls");
    screen.hide("mdc-911-table")
    `);
  }
  //   mp.events.callRemote("server:mdc:fetchCallList", (emergencyCalls));
  mp.gui.cef.execute(`
  mdc.show('#mdc_911Calls');
  screen.show("mdc");

  `);
});

// mp.events.add("client:mdc:updateEmergencyCalls", (emergencyCalls) =>{

// })

mp.events.add("client:mdc:fetchPlayerData", (plName) => {
  mp.events.callRemote("server:mdc:fetchPlayerData", plName);
});

mp.events.add("client:mdc:fetchVehicleData", (license) => {
  mp.events.callRemote("server:mdc:fetchVehicleData", license);
});

mp.events.add("client:mdc:fetchCharges", (plName, lastID) => {
  mp.gui.chat.push("Fetch Charges");
  mp.events.callRemote("server:mdc:fetchCharges", plName, lastID);
});

mp.events.add("client:mdc:returnPlayerData", (mdcPlayerRecords) => {
  let data = JSON.parse(mdcPlayerRecords);

  if (data.length > 0) {
    for (var d in data) {
      mp.gui.cef.execute(`
      mdc.addPlayerRecords("${data[d].id}","${data[d].name}")`);
    }
    mp.gui.cef.execute(`
      screen.hide("mdc_noplrecords");
      screen.show("mdc__plTable");
      `);
  } else {
    // mp.gui.chat.push("Not execute");
    mp.gui.cef.execute(
      `screen.hide("mdc__plTable");
       screen.show("mdc_noplrecords")`
    );
  }
});

mp.events.add("client:mdc:returnVehicleData", (mdcVehicleRecords) => {
  let data = JSON.parse(mdcVehicleRecords);

  if (data.length > 0) {
    for (var d in data) {
      let vehicle_name = mp.game.ui.getLabelText(
        mp.game.vehicle.getDisplayNameFromVehicleModel(
          mp.game.joaat(data[d].name)
        )
      );

      mp.gui.cef.execute(`
      mdc.addVehicleRecords("${data[d].owner}","${vehicle_name}","${data[d].numberPlate}")`);
    }
    mp.gui.cef.execute(`
      screen.hide("mdc_norecords");
      screen.show("mdc__vehTable");
      `);
  } else {
    // mp.gui.chat.push("Not execute");
    mp.gui.cef.execute(
      `screen.hide("mdc__vehTable");
       screen.show("mdc_norecords")`
    );
  }
  //   `  "for(var r in result){ \
  //      $('.first').html(${result.owner})  \
  //           $('.second').html("${result.name}")   \
  //           $('.third').html("${result.numberPlate}")   \
  //          $('.fourth').html("${result.owner}")                     \

  //         }`

  //   } else {
  //     mdcBrowser.execute(
  //       "var alertElement = $(' <div class= \"alert alert-danger\">Incorrect username or password.</div > '); \
  //                  $('.searchVeh').append(alertElement);"
  //     );
  //   }
});

mp.events.add("c:mdc:hideInfoWindow", () => {
  mp.game.graphics.transitionFromBlurred(250);
  if (mp.gui.cursor.visible) {
    mp.game.audio.playSoundFrontend(
      -1,
      "Hack_Failed",
      "DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS",
      false
    );
  }

  mp.gui.chat.activate(true);
  // mp.gui.chat.activate(false);
  mp.gui.cef.execute(`
  screen.hide("mdc");
  `);

  setTimeout(function () {
    mp.gui.cursor.show(false, false);
    mp.gui.cef.execute(`
    $("#mdc_callsResults").empty();
    $("#mdc__login_name").remove();
    `);
  }, 200);
  //   mp.browsers.at(0).destroy();
});

mp.events.add("c:mdc:hideChargeForm", () => {
  mp.gui.cef.execute(`screen.hide("mdc-charges-box");`);
  // mp.gui.cef.execute(`$(".mdc-charges-box-form").empty()`);
});

mp.events.add(
  "client:mdc:addCharge",
  (suspect, crime, punishmentType, amount) => {
    mp.gui.chat.push("Triggered de khan" + crime + punishmentType + amount);
    mp.events.callRemote(
      "server:mdc:addCharges",
      suspect,
      crime,
      punishmentType,
      amount
    );
  }
);

mp.events.add("client:mdc:displayCharges", (charges_str, lastID, error) => {
  if (error) {
    mp.gui.chat.push("Error Triggered" + charges_str + lastID + error);
    mp.gui.cef.execute(`screen.hide("mdc__chrgTable");
                        screen.show("mdc_nocharges")
                      `);
  } else {
    mp.gui.chat.push("No Error Triggered" + charges_str + lastID + error);
    // let data = JSON.parse(charges_str);
    // for (var d in data) {
    //   let date = new Date(data[d].charge_time);
    //   let dateStamp =
    //     date.getDate() +
    //     "-" +
    //     (date.getMonth() + 1) +
    //     "-" +
    //     date.getFullYear() +
    //     " " +
    //     date.getHours() +
    //     ":" +
    //     date.getMinutes();

    //   mp.gui.cef.execute(`
    //    mdc.displayCharge(${data[d].id},"${dateStamp}", "${data[d].officer}", "${data[d].crime}", "${data[d].punishment}", ${data[d].amount})
    //   `);
    // }
    // mp.gui.cef.execute(`
    //   screen.hide("mdc_nocharges");
    //   screen.show("mdc__chrgTable");
    // `);
    mp.gui.cef.execute(`mdc.displayCharge('${charges_str}', ${lastID})`);
    mp.gui.cef.execute(`
       screen.hide("mdc_nocharges");
       screen.show("mdc__chrgTable");
     `);
  }

  // if (data.length > 0) {
});

mp.events.add("client:mdc:loadChargeLog", (plName, id) => {
  mp.gui.chat.push("Load Charge Log Event Triggered" + plName + id);
  mp.events.callRemote("server:mdc:fetchCharges", plName, id);
});

mp.events.add("c:mdc:testMethod", (crime, punishment) => {
  mp.gui.chat.push("Da de trigger sho" + crime + punishment);
});

mp.events.add("client:mdc:deleteCallRecord", (id) => {
  mp.events.callRemote("server:mdc:deleteCallRecord", id);
});

mp.events.add("client:mdc:deleteChargeRecord", (id) => {
  mp.gui.chat.push("Da de trigger sho" + id);
  mp.events.callRemote("server:mdc:deleteChargeRecord", id);
});

let temp_markers_list = {};

mp.events.add(
  "client:utils:callerCoords",
  (id, _name, _model, _color, x, y, z) => {
    // mp.gui.chat.push(x + "," + y + "," + z);
    if (temp_markers_list[id] != undefined) return true;
    temp_markers_list[id] = mp.blips.new(_model, new mp.Vector3(x, y, z), {
      color: _color,
      name: _name,
      scale: 1.0,
      shortRange: false,
    });
    setTimeout(function () {
      if (temp_markers_list[id] == undefined) return;
      temp_markers_list[id].destroy();
      delete temp_markers_list[id];
    }, 180000);
  }
);

// severniye's method
mp.events.add(
  "client:utils:createTempBlip",
  (id, _name, _model, _color, _scale, _short, x, y, z) => {
    if (temp_markers_list[id] != undefined) return true;

    temp_markers_list[id] = mp.blips.new(_model, new mp.Vector3(x, y, z), {
      color: _color,
      name: _name,
      scale: 1.0,
      shortRange: false,
    });

    setTimeout(function () {
      if (temp_markers_list[id] == undefined) return;

      temp_markers_list[id].destroy();

      delete temp_markers_list[id];
    }, 180000);
  }
);

// Severniye Olen
/*mp.players.forEach((pl) => {
  
    if(pl.getVariable("faction") == POLICE_ID && pl.getVariable("isOnFactionDuty") == true)
     {
    pl.call("client:utils:createTempBlip", [
         "service911"+player.sqlID,
      "911",
            162, 6, 1.0, false,
              player.position.x,
              player.position.y,
              player.position.z
       ]);
  
     pl.outputChatBox(!{#abcdef}[911] ${player.name}[${player.id}] calls the police (${msg}));
         }
         });
      */

mp.Vector3.getDistanceBetweenPoints3D = function (v1, v2) {
  return Math.abs(
    Math.sqrt(
      Math.pow(v2.x - v1.x, 2) +
        Math.pow(v2.y - v1.y, 2) +
        Math.pow(v2.z - v1.z, 2)
    )
  );
}; // function calculating the distance between two points in the space X; Y; Z;
