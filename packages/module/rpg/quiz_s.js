// const questions_data = [
// {
// question: "Which one of the 4 answers below is a clear breach of power-gaming?",
// answers:
// a: "Tom punches the man, attempting to knock him to the floor.",
// b: "Tom breaks a set of handcuffs off of his wrist using his pure strength and starts to run away.",
// c: "Tom speeds through a red light and looses control of the vehicle.",
// d: "Tom hands his keys to another person, allowing them to drive his car.",
// answer
// }

// ]

// global.player.attempt = 0;

const QUIZ_FIRST_ATTEMPT = 0;
const QUIZ_SECOND_ATTEMPT = 1;
const QUIZ_THIRD_ATTEMPT = 2;

const QUIZ_STATUS_NONE = null;
const QUIZ_STATUS_PASS = "Pass";
const QUIZ_STATUS_FAIL = "Fail";

mp.events.addCommand("quiz", (player) => {
  if (!mp.players.exists(player)) return false;
  // player.call("client:mdc:resultsCallList", [JSON.stringify(emergencyCalls)]);
  player.call("client:quiz:showQuizData");
});

mp.events.add("server:quiz:loginPlayer", (player) => {
  gm.mysql.connection.query(
    "SELECT `quizAtmpt`, `quizStatus`, `quizTime` FROM `users` WHERE `lastSocial` = ? LIMIT 1",
    [player.socialClub],
    function (err, data) {
      if (err) console.log(err);
      if (data.length > 0) {
        var playerQuizAttempts = data[0].quizAtmpt;
        let quizStatus = data[0].quizStatus;
        let quizTimeStamp = data[0].quizTime;

        if (quizStatus === "Pass")
          player.outputChatBox("You have logged in successfully");
        // ->  Show Player Spawn Creator
        else quizChecker(player, playerQuizAttempts, quizTimeStamp);
      } else {
        // Create Account
        //
        console.log("player will be kicked");
      }
    }
  );

  return true;
});

mp.events.add("server:quiz:quizFailed", (player, attempts) => {
  gm.mysql.connection.query(
    "UPDATE users SET quizStatus = ?, quizAtmpt = ?, quizTime = CURRENT_TIMESTAMP() WHERE lastSocial = ? OR regSocial = ?",
    ["Fail", attempts + 1, player.socialClub, player.socialClub],
    function (err2, inserted) {
      if (!mp.players.exists(player)) return true;
      if (err2) {
        // gm.core.show(player, "alert-red", "MDC Error #1");
        console.log(err2);
        return false;
      }
      // gm.utils.sendAdminMessage(`!{3cdd87} ${player.name}[${player.sqlID}] has failed the registration quiz. Total Attempts: ${attempts + 1}`);

      return true;
    }
  );
  player.outputChatBox(
    `!{red}Sorry you failed the Registration Quiz. Please read the rules again and reconnect to attempt your quiz again. You have attempted the quiz ${
      attempts + 1
    } time(s).`
  );
  setTimeout(() => player.kick("Failed Quiz"), 1000);

  // Kick Player after Failin
});

mp.events.add("server:quiz:quizPassed", (player, attempts) => {
  gm.mysql.connection.query(
    "UPDATE users SET quizStatus = ?, quizAtmpt = ?, quizTime = CURRENT_TIMESTAMP() WHERE lastSocial = ? OR regSocial = ?",
    ["Pass", attempts + 1, player.socialClub, player.socialClub],
    function (err2, inserted) {
      if (!mp.players.exists(player)) return true;
      if (err2) {
        // gm.core.show(player, "alert-red", "MDC Error #1");
        console.log(err2);
        return false;
      }
      // gm.utils.sendAdminMessage(`!{3cdd87} ${player.name}[${player.sqlID}] has passed the registration quiz`);

      return true;
    }
  );
  // Show Player Spawn Creator
});

function quizChecker(player, attempt, lastAttempted) {
  let date = new Date(lastAttempted);
  lastAttempted = date.getTime();
  let dateNow = Date.now();
  let diffMinutes = Math.floor((dateNow - lastAttempted) / 1000 / 60);
  let reconnectTime = "";

  switch (attempt) {
    // three times / twice in var MAYBE
    case QUIZ_FIRST_ATTEMPT:
      player.call("client:quiz:showQuizData", [attempt]);
      break;
    case QUIZ_SECOND_ATTEMPT:
      reconnectTime = 30 - diffMinutes + " minutes";
      if (diffMinutes > 30) player.call("client:quiz:showQuizData", [attempt]);
      else quizFailed(player, reconnectTime, attempt);
      break;

    case QUIZ_THIRD_ATTEMPT:
      reconnectTime = 30 - diffMinutes + " minutes";
      if (diffMinutes > 30) player.call("client:quiz:showQuizData", [attempt]);
      else quizFailed(player, reconnectTime, attempt);
      break;

    default:
      let reconHours = (1440 - diffMinutes) / 60;
      let reconRndHours = Math.floor(reconHours);
      let reconMinutes = (reconHours - reconRndHours) * 60;
      let reconRndMinutes = Math.floor(reconMinutes);
      reconnectTime =
        reconRndHours + " hour(s) " + reconRndMinutes + " minutes(s) ";
      if (diffMinutes > 1440)
        player.call("client:quiz:showQuizData", [attempt]);
      else quizFailed(player, reconnectTime, attempt);

      break;
  }

  return true;
}

function quizFailed(player, minutes, attempts) {
  // player.outputChatBox(
  //   `!{red}You have failed your registration quiz ${times}. Please relog in ${minutes} to reattempt your quiz.`
  // );
  player.outputChatBox(
    `!{red}Sorry, you failed the Registration Quiz. Please read the rules again and reconnect in ${minutes} to attempt your quiz again. You have attempted the quiz ${attempts} time(s).`
  );
  setTimeout(() => player.kick("Failed Quiz"), 1000);
}
