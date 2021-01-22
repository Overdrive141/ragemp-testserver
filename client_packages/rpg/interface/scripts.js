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

let quiz = {
  question: "",
  correctAnswer: "",
  answers: [],
  values: [],
  rowCount: 0,
  score: 0,

  show: function (nextID, prevID) {
    // $(".mdc_screens").css("display", "none");
    $(`#${nextID}`).fadeIn(100);
    $(`#${prevID}`).remove();
    // $("#reg__quiz__box_2").empty();
    // $(id).css("display", "inline");
    // mp.trigger("client:mdc:fetchCallList");
  },
  close: function () {
    mp.trigger("client:quiz:hideRegQuiz", true);
  },
  next: function (page, nextID, prevID) {
    // TODO: Change it to subitmaybe.

    if (page == 1) {
      let q1 = parseInt(
        $("input[name='reg_quiz_test__question_1']:checked").val()
      );
      let q2 = parseInt(
        $("input[name='reg_quiz_test__question_2']:checked").val()
      );
      let q3 = parseInt(
        $("input[name='reg_quiz_test__question_3']:checked").val()
      );
      let q4 = parseInt(
        $("input[name='reg_quiz_test__question_4']:checked").val()
      );
      let q5 = parseInt(
        $("input[name='reg_quiz_test__question_5']:checked").val()
      );

      if (isNaN(q1)) return;
      if (isNaN(q2)) return;
      if (isNaN(q3)) return;
      if (isNaN(q4)) return;
      if (isNaN(q5)) return;

      this.score = q1 + q2 + q3 + q4 + q5;

      this.show(nextID, prevID);
    } else if (page == 2) {
      let q6 = parseInt(
        $("input[name='reg_quiz_test__question_6']:checked").val()
      );
      let q7 = parseInt(
        $("input[name='reg_quiz_test__question_7']:checked").val()
      );
      let q8 = parseInt(
        $("input[name='reg_quiz_test__question_8']:checked").val()
      );
      let q9 = parseInt(
        $("input[name='reg_quiz_test__question_9']:checked").val()
      );
      let q10 = parseInt(
        $("input[name='reg_quiz_test__question_10']:checked").val()
      );

      if (isNaN(q6)) return;
      if (isNaN(q7)) return;
      if (isNaN(q8)) return;
      if (isNaN(q9)) return;
      if (isNaN(q10)) return;

      this.score = this.score + q6 + q7 + q8 + q9 + q10;
      this.show(nextID, prevID);
    }
  },
  submit: function () {
    let q11 = parseInt(
      $("input[name='reg_quiz_test__question_11']:checked").val()
    );
    let q12 = parseInt(
      $("input[name='reg_quiz_test__question_12']:checked").val()
    );

    if (isNaN(q11)) return;
    if (isNaN(q12)) return;

    this.score = this.score + q11 + q12;

    mp.trigger("client:quiz:submitQuiz", this.score);
  },
  loadQuiz: function (questionData) {
    questionData = JSON.parse(questionData);

    for (let i = 0; i < questionData.length; i++) {
      question = questionData[i].question;
      // let correct = answers.indexOf(questionData[i].correct);
      // correctAnswer = questionData[i].answers[questionData[i].correct]; Discontinued

      // if (!this.answers.includes(correct)) {
      //   answers = [
      //     questionData[i].answers[i],
      //     questionData[i].answers[i + 1],
      //     questionData[i].answers[i + 2],
      //     //questionData[i].answers[i + 3],
      //   ];
      // } Discontinued

      answers = [
        questionData[i].answers[0][0],
        questionData[i].answers[1][0],
        questionData[i].answers[2][0],
        questionData[i].answers[3][0],
      ];

      values = [
        questionData[i].answers[0][1],
        questionData[i].answers[1][1],
        questionData[i].answers[2][1],
        questionData[i].answers[3][1],
      ];

      let questionElem = $(
        `<div class="info-box-subheader">${i + 1}. ${question}</div>`
      );

      let answersElem = $(`
      <input type="radio"  id="reg_quiz_test__row${
        this.rowCount
      }" name="reg_quiz_test__question_${i + 1}" value="${values[0]}">
      <label for="reg_quiz_test__row${
        this.rowCount
      }" class="info-box-link-radio">${answers[0]}</label><br>
      <input type="radio"  id="reg_quiz_test__row${
        this.rowCount + 1
      }" name="reg_quiz_test__question_${i + 1}" value="${values[1]}">
      <label for="reg_quiz_test__row${
        this.rowCount + 1
      }" class="info-box-link-radio">${answers[1]}</label><br>
      <input type="radio"  id="reg_quiz_test__row${
        this.rowCount + 2
      }" name="reg_quiz_test__question_${i + 1}" value="${values[2]}">
      <label for="reg_quiz_test__row${
        this.rowCount + 2
      }" class="info-box-link-radio">${answers[2]}</label><br>
      <input type="radio"  id="reg_quiz_test__row${
        this.rowCount + 3
      }" name="reg_quiz_test__question_${i + 1}" value="${values[3]}">
      <label for="reg_quiz_test__row${
        this.rowCount + 3
      }" class="info-box-link-radio">${answers[3]}</label><br>
      `);

      // mp.trigger("c:mdc:testMethod", this.rowCount);
      $("#reg__quiz__box_2").append(questionElem, answersElem);
      // $("#reg__quiz__box_1").append();

      // $("#reg_quiz__box").append(correctElem);

      mp.trigger("c:mdc:testMethod");
      this.rowCount += 4;
    }

    $("#reg__quiz__box_2").append(
      $(`<div class="info-box-btns">
   <span class="btn-medium btn-purple" onclick="quiz.next(1, 'reg__quiz__box_3', 'reg__quiz__box_2')">Next</span>
  </div>`)
    );
  },
};

let timeoutBox = {
  // Lin - My Method - MDC DELAY
  delay: 0,
  interval: null,

  message: function (style, text, time) {
    let double_message = false;

    $("#alerts__list .alert-progress").each(function (index) {
      if ($(this).text() == text) double_message = true;
    });

    if (double_message == true) return;

    if (this.interval != null) clearInterval(this.interval);

    let elem = $(`
			<div class="alert-progress ${style}" id="alert_box__timeout">${text}. Please wait for ${time} seconds</div>
		`);

    let cancelBtn = $(
      `<span class="btn-medium btn-red btn-bottom-center" id="alert_box__timeout_btnCancel" onclick="timeoutBox.stopDelay()">Cancel</span>`
    );

    $("#alerts__list").prepend(elem);
    $("#alerts__list").append(cancelBtn);

    this.interval = setInterval(function () {
      if (timeoutBox.delay > 1) {
        timeoutBox.delay--;
        $(`#alert_box__timeout`).html(
          `${text}. Please wait for ${timeoutBox.delay} seconds`
        );
      } else {
        clearInterval(timeoutBox.interval);
        timeoutBox.interval = null;
        $("#alert_box__timeout").remove();
        $("#alert_box__timeout_btnCancel").remove();
      }
    }, 1000);

    this.delay = time;

    //   setTimeout(function () {
    //     $(elem).remove();
    //     $(cancelBtn).remove();
    //   }, time);
  },
  stopDelay: function () {
    if (this.interval != null) {
      clearInterval(this.interval);
      this.interval = null;
    }
    mp.trigger("c:utils:cancelBlockedControls");
    $("#alert_box__timeout").remove();
    $("#alert_box__timeout_btnCancel").remove();
  },
};
