let alerts = {
  message: function (style, text) {
    let double_message = false;

    $("#alerts__list .alert-message").each(function (index) {
      if ($(this).text() == text) double_message = true;
    });

    if (double_message == true) return;

    let elem = $(`
			<div class="alert-message ${style}">${text}</div>
		`);

    $("#alerts__list").prepend(elem);

    setTimeout(function () {
      $(elem).remove();
    }, 4400);
  },
  // Lin - My Method
  progress: function (style, text, type) {
    let double_message = false;
    let delay = 0;

    $("#alerts__list .alert-message").each(function (index) {
      if ($(this).text() == text) double_message = true;
    });

    if (double_message == true) return;
    if (type === "repair") delay = 10000;
    else if (type === "heal") delay = 5000;

    let elem = $(`
			<div class="alert-message ${style}">${text}</div>
		`);

    $("#alerts__list").prepend(elem);

    setTimeout(function () {
      $(elem).remove();
    }, delay);
  },
};

let screen = {
  show: function (name, speed = 200) {
    $("#" + name).fadeIn(speed);
  },

  hide: function (name, speed = 200) {
    $("#" + name).fadeOut(speed);

    setTimeout(function () {
      $("#" + name + " .__remove-on-close__").remove();
    }, speed);
  },
};

let hud = {
  micActive: function (toggle, radio) {
    let isRadioClass = $("#hud__mic").hasClass("hud-mic-radio");

    if (radio && !isRadioClass) $("#hud__mic").addClass("hud-mic-radio");
    else if (!radio && isRadioClass)
      $("#hud__mic").removeClass("hud-mic-radio");

    if (toggle == true) $("#hud__mic").fadeIn(200);
    else $("#hud__mic").fadeOut(200);
  },
};

let mdc = {
  lastLogPos: 0,
  MAX_LOG_LINES: 30,

  show: function (id) {
    $(".mdc_screens").css("display", "none");
    $(id).css("display", "inline");
    // mp.trigger("client:mdc:fetchCallList");
  },
  showPlName: function (name) {
    //NEW
    let l_name;
    if (!name.includes("_")) l_name = name;
    else {
      let fullname = name.split("_");
      l_name = fullname[1];
    }
    $("#mdc__title").append(
      `<p id="mdc__login_name">Logged in as Officer ${l_name}</p>`
    );
  },
  searchVehicles: function () {
    $("#mdc_vehResults").empty();
    mp.trigger("client:mdc:fetchVehicleData", $("#searchVeh").val());
    // mp.gui.chat.push($("#searchVeh").val());
  },
  searchPlayers: function () {
    $("#mdc_playerResults").empty();
    $("#mdc__plCharges_name").empty();
    $("#mdc_plCharges").empty();
    $("#charges__log-load-button").remove(); //new
    $("#mdc__plDetails").fadeOut(0);
    mp.trigger("client:mdc:fetchPlayerData", $("#searchPl").val());
  },
  plBackBtn: function (speed = 0) {
    $("#mdc__plTable").fadeIn(speed);
    $("#mdc__plDetails").fadeOut(speed);
    $("#mdc_plCharges").empty();
    $("#charges__log-load-button").remove(); //new
    $("#mdc__plCharges_name").empty();
  },
  plAddCharge: function () {
    $("#mdc-charges-box").fadeIn(50);
  },
  //TODO: Get Coords (with ID) & Resolve (Filter Array / MAP)
  addCallRecords: function (
    id,
    callerName,
    message,
    posX,
    posY,
    posZ,
    timeCalled
  ) {
    $("#mdc_callsResults").append(`
    <tr id="mdc__callsrow-${id}">
    <td>${timeCalled}</td>
    <td style="max-width: 150rem">${callerName}</td>
    <td style="max-width: 250rem">${message}</td>
    <td style="width: 70rem"><span class="btn-small-table btn-red" onclick="mdc.getCoords(${posX},${posY},${posZ})">Set Marker</span></td>
    <td style="width: 70rem"><span class="btn-small-table btn-green" onclick="mdc.resolveCall(${id})">Resolve</span></td>
    </tr>

    `);
  },
  resolveCall: function (id, speed = 200) {
    $("#" + `mdc__callsrow-${id}`).fadeOut(speed, () => {
      $("#" + `mdc__callsrow-${id}`).remove();
      if ($("#mdc__911table tr").length < 2) {
        $("#mdc_nocalls").fadeIn(speed);
        $("#mdc-911-table").fadeOut(speed);
        // mdc.hide
      }
    });
    mp.trigger("client:mdc:deleteCallRecord", id);
  },
  getCoords: function (posX, posY, posZ) {
    mp.trigger(
      "client:utils:callerCoords",
      1,
      "911 Call",
      8,
      3,
      posX,
      posY,
      posZ
    );
  },
  addVehicleRecords: function (owner, vehName, numPlate) {
    // mp.trigger("c:mdc:testMethod");
    $("#mdc_vehResults").append(`
    <tr>
    <td>${owner}</td>
    <td>${vehName}</td>
    <td>${numPlate}</td>
    </tr>
    `);
  },
  addPlayerRecords: function (id, name) {
    $("#mdc_playerResults").append(`
    <tr>
    <td id="mdc__plID_${id}">${id}</td>
    <td id="mdc__plName_${name}">${name}</td>
    <td><span class="btn-small-table btn-green" onclick="mdc.playerDetails('${name}')">Details</span></td>
    </tr>
    `);
  },
  playerDetails: function (name, speed = 0) {
    $("#mdc__plTable").fadeOut(speed);
    $("#mdc__btnBack").after(`
      <div class="player-charges-header-title" id="mdc__plCharges_name">Charges for ${name}</div>
    `);
    $("#mdc__plDetails").fadeIn(speed);
    mp.trigger("client:mdc:fetchCharges", name, 0);
  },
  addCharge: function () {
    let crime = $("#mdc__plCrime").val();
    let punishmentType = $("input[name='crime_committed']:checked").val();
    let amount = parseInt($("#mdc__plTicketAmount").val());
    let suspect = $("#mdc__plCharges_name").text().substring(12);

    if (punishmentType === "Arrested" || punishmentType === "Warning")
      amount = 0;

    if (crime == undefined || punishmentType == undefined || isNaN(amount))
      return false;

    mp.trigger("c:mdc:hideChargeForm");
    $("#mdc_plCharges").empty();
    $("#charges__log-load-button").remove(); //new
    mp.trigger("client:mdc:addCharge", suspect, crime, punishmentType, amount);
    $("#mdc__charges_form input:text").val("");
    $("input:radio").attr("checked", false);
  },
  deleteCharge: function (id, speed = 200) {
    $("#" + `mdc__charges_row-${id}`).fadeOut(speed, () => {
      $("#" + `mdc__charges_row-${id}`).remove();
      if ($("#mdc__chargesListTable tr").length < 2) {
        $("#mdc_nocharges").fadeIn(speed);
        $("#mdc__chrgTable").fadeOut(speed);
        // mdc.hide
      }
    });
    mp.trigger("client:mdc:deleteChargeRecord", id);
  },
  // displayCharge: function (id, time, officer, crime, punishment, amount) {

  displayCharge: function (charges_str, id) {
    if (id) this.lastLogPos = parseInt(id);

    let data = JSON.parse(charges_str);
    let suspectName = data[0].suspect;

    for (var d in data) {
      let date = new Date(data[d].charge_time);
      let dateStamp =
        date.getDate() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getFullYear() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes();

      $("#mdc_plCharges").append(`
      <tr id="mdc__charges_row-${data[d].id}">
        <td>${dateStamp}</td>
        <td>${data[d].officer}</td>
        <td>${data[d].crime}</td>
        <td>${data[d].punishment}</td>
        <td>$${data[d].amount}</td>
        <td>
          <span class="btn-red btn-xsmall-table" onclick="mdc.deleteCharge(${data[d].id})">
           <img src="delete.svg" style="height: 14rem; width: 14rem"/>
          </span>
        </td>
      </tr>
    `);
    }

    if (data.length >= this.MAX_LOG_LINES) {
      mp.trigger("c:mdc:testMethod", suspectName, suspectName);
      $("#mdc__chargesListTable").after(
        `<span class="btn-small btn-green load-button" id="charges__log-load-button" onclick="mdc.loadChargeLog('${suspectName}')">Load more</span>`
      );
    }
  },
  loadChargeLog: function (plName) {
    mp.trigger("c:mdc:testMethod", "Error2", plName);
    $("#charges__log-load-button").remove();
    mp.trigger("client:mdc:loadChargeLog", plName, this.lastLogPos);
  },
  cancelChargeForm: function () {
    mp.trigger("c:mdc:hideChargeForm");
  },
  close: function () {
    // mp.browsers.at(0).destroy;
    // // browser.destroy();
    // mp.gui.cursor.show(false, false);

    mp.trigger("c:mdc:hideInfoWindow");

    // $("#mdc_callsResults").empty();
  },
};
