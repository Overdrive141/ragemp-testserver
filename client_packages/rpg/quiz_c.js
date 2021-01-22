// if Quiz N F P
// showQuizData Server Side -> (if quiz == false) showQuizData else showLogin

let chosen_questions = [];
var playerQuizAttempts = 0;

const quiz_part_1 = [
  {
    //Problem Maybe
    question: "What is an example of breaking the Fear-RP rule?",
    answers: [
      ["Running in the middle of the road and making scary noises.", 0],
      [
        "Running away with a gun aimed at you, showing no signs of fearing for your life.",
        1,
      ],
      ["Eating a pack of sweets whilst watching a scary movie.", 0],
      [
        "Aiming a gun at a civilian, shouting at him and showing no mercy towards the civilian.",
        0,
      ],
    ],
    // correct: 1,
  },
  // {/ADDED TO HTML
  //   //Problem Maybe
  //   question:
  //     "Which one of the 4 answers below is a clear breach of power-gaming?",
  //   answers: [
  //     ["Tom punches the man, attempting to knock him to the floor.", "0"],
  //     [
  //       "Tom breaks a set of handcuffs off of his wrist using his pure strength and starts to run away.",
  //       "1",
  //     ],
  //     [
  //       "Tom speeds through a red light and looses control of the vehicle.",
  //       "0",
  //     ],
  //     [
  //       "Tom hands his keys to another person, allowing them to drive his car.",
  //       "0",
  //     ],
  //   ],

  //   // correct: 1,
  // },
  // { //ADDED TO HTML
  //   question:
  //     "Which one of the 4 answers below is a clear breach of meta-gaming?",
  //   answers: [
  //     ["Ben uses his iPad Radio to call in back-up.", 0],
  //     [
  //       "Ben looks at Bobs clothes and assumes he knows what gang he is a part of.",
  //       0,
  //     ],
  //     [
  //       "Ben mentions that he has a pistol on him in OOC chat, \nBob uses this to his advantage and later on robs him for the Pistol.",
  //       1,
  //     ],
  //     ["Ben laughs at Jims comment.", 0],
  //   ],
  //   // correct: 2,
  // },
  // { // Added to Separate Combo
  //   question: "What is a suitable RP name?",
  //   answers: [
  //     ["Harry Potter", 0],
  //     ["Innocent Prince", 0],
  //     ["Lana Rhoades", 0],
  //     ["Jimmy Harrison", 1],
  //   ],
  //   // correct: 3,
  // },
  // { // Added to Separate Combo
  //     "Which one of the 4 answers below is a clear breach of Vehicle Death Match (VDM)?",
  //   answers: [
  //     ["John punches a car that is parked at the side.", 0],
  //     ["John shoots at someone whilst in a moving vehicle.", 0],
  //     ["John runs someone over and kills them.", 1],
  //     ["John uses a police cruiser to pit an evading vehicle.", 0],
  //   ],
  //   // correct: 2,
  // },
  {
    question:
      "Which one of the 4 answers below is a clear breach of Random Death Match (RDM)?",
    answers: [
      ["Ellis has a reason to shoot someone so he begins to shoot.", 0],
      [
        "Ellis attempts to rob an enemy gang member but they do not comply so he shoots him.",
        0,
      ],
      ["Ellis holds his gun out whilst walking down the street.", 0],
      [
        "Ellis feels like killing some people so he begins shooting at random people for no reason",
        1,
      ],
    ],
    // correct: 3,
  },

  // { // Added to Separate Combo
  //   question: "What does IC mean?",
  //   answers: [
  //     ["In Character", 1],
  //     ["In Context", 0],
  //     ["Inbetween Characters", 0],
  //     ["In Charge", 0],
  //   ],
  //   // correct: 0,
  // },
  // { // Added to Separate Combo
  //   question: "What does NLR mean?",
  //   answers: [
  //     ["New Language Roleplay", 0],
  //     ["Northen Language Rule", 0],
  //     ["New Life Rule", 1],
  //     ["No Life Rule", 0],
  //   ],
  //   // correct: 2,
  // },
  // {
  //   // Problem maybe
  //   question:
  //     "Tom gets a message from Jack on Discord. Tom reads the message, saying: Come help me, I'm being robbed at the Power Station. /n As soon as Tom reads this, he goes to help Jack out at the Power Station. What is wrong with this situation?",
  //   answers: [
  //     ["Tom would be Power Gaming.", 0],
  //     ["Tom would be breaking NLR.", 0],
  //     ["Tom would be Meta Gaming.", 1],
  //     ["Tom would be a great friend.", 0],
  //   ],
  //   // correct: 2,
  // },
  // {
  //   //Added to Combo
  //   question: "What is an example of breaking the Fear-RP rule?",
  //   answers: [
  //     ["Running in the middle of the road and making scary noises.", 0],
  //     [
  //       "Running away with a gun aimed at you, showing no signs of fearing for your life.",
  //       1,
  //     ],
  //     ["Eating a pack of sweets whilst watching a scary movie.", 0],
  //     [
  //       "Aiming a gun at a civilian, shouting at him and showing no mercy towards the civilian.",
  //       0,
  //     ],
  //   ],
  //   // correct: 1,
  // },
  // {
  //   ////ADDED TO HTML
  //   question: "What is an example of breaking the Fail-RP rule?",
  //   answers: [
  //     ["Alex begins robbing a bank with his gang.", 0],
  //     [
  //       "Alex doesn't let another player take his weapons when he has a gun to his head.",
  //       1,
  //     ],
  //     [
  //       "Alex drops all of his ammo for his friend becuase he didn't have much left.",
  //       0,
  //     ],
  //     [
  //       "Alex lets his mate drive his car for him becasue he can't be bothered to drive.",
  //       0,
  //     ],
  //   ],
  //   // correct: 1,
  // },
  // {
  //   //ADDED TO HTML
  //   question:
  //     "Jimmy had a gunfight with Bobby, where Bobby kills him eventually. Jimmy respawned in the hospital and then proceeds to go back to Bobby to kill him. What is wrong with this situation?",
  //   answers: [
  //     ["Jimmy broke the FearRP rule.", 0],
  //     ["Jimmy broke the FailRP rule.", 0],
  //     ["Jimmy broke NLR.", 1],
  //     ["Jimmy is Power Gaming.", 0],
  //   ],
  //   // correct: 2,
  // },

  {
    //Problem
    question: "What is a Green Zone?",
    answers: [
      ["An area where there are green lights.", 0],
      ["An area where you can do anything.", 0],
      ["An area where any form of crimes are not allowed.", 1],
      ["An area where everyone is green", 0],
    ],
    // correct: 2,
  },
  // { ADDED TO HTML
  //   question:
  //     "You run a red light and a cop starts following you. He catches up with you after a few minutes and he signals you to pull over. \nHowever, you don't stop and run away, the officer calls backup and they all start to chase you. /n Eventually, they pit your car and your car flips over. What would you do in this situation? ",
  //   answers: [
  //     [
  //       "I would get out of my car, use a car jack to flip my car back, and attempt to flee.",
  //       0,
  //     ],
  //     [
  //       "I would RP my injuries and stay inside my car, while the car is upside down.",
  //       0,
  //     ],
  //     ["I would restart the game to avoid the situation.", 0],
  //     ["I would RP my injuries and get out of the car.", 1],
  //   ],
  //   // correct: 3,
  // },
  // {
  //   //Problem Maybe
  //   question:
  //     "You are attempting to rob someone at the roadside. How would you RP correctly using the /me & /do commands in this situation?",
  //   answers: [
  //     ["/me Hey how are you doing Today? /do I hope you're fine", 0],
  //     ["/me is trying to rob a man. /do Is trying to rob a man", 0],
  //     ["/me attempts to pat down the man. /do Am I able to do so?", 1],
  //     ["/me asks how his friend is. /do Is everything okay?", 0],
  //   ],
  //   // correct: 2,
  // },
  {
    question:
      "Which one of the 4 answers below is a clear breach of Vehicle Death Match (VDM)?",
    answers: [
      ["John punches a car that is parked at the side.", 0],
      ["John shoots at someone whilst in a moving vehicle.", 0],
      ["John runs someone over and kills them.", 1],
      ["John uses a police cruiser to pit an evading vehicle.", 0],
    ],
    // correct: 2,
  },
];

const quiz_part_2 = [
  {
    question: "What is a suitable RP name?",
    answers: [
      ["Harry Potter", 0],
      ["Innocent Prince", 0],
      ["Lana Rhoades", 0],
      ["Jimmy Harrison", 1],
    ],
    // correct: 3,
  },
  {
    question: "What does NLR mean?",
    answers: [
      ["New Language Roleplay", 0],
      ["Northen Language Rule", 0],
      ["New Life Rule", 1],
      ["No Life Rule", 0],
    ],
    // correct: 2,
  },

  {
    question: "What does IC mean?",
    answers: [
      ["In Character", 1],
      ["In Context", 0],
      ["Inbetween Characters", 0],
      ["In Charge", 0],
    ],
    // correct: 0,
  },
  {
    question: "What does OOC mean?",
    answers: [
      ["Out of Context", 0],
      ["Out of Controller", 0],
      ["Out of Charge", 0],
      ["Out of Character", 1],
    ],
    // correct: 3,
  },
  {
    question: "What is cop-baiting?",
    answers: [
      ["Giving a cop a fishing rod so he can go fishing.", 0],
      ["Tormenting police so they chase you.", 1],
      ["Going to the police station to report a crime.", 0],
      ["Telling your friends that you hate the cops.", 0],
    ],
    // correct: 1,
  },
];

const agreement_question_data = [
  {
    question: "Why did you take this test?",
    answers: [
      ["I don't know, I had to take it to join the server.", 0],
      ["I want to show that I understand the basic rules of the server. ", 1],
      ["I was bored so I joined the server for some fun.", 0],
    ],
  },
  {
    question:
      "Do you understand that if you break any rules, it could lead to you getting banned from the server?",
    answers: [
      ["I agree.", 1],
      ["I disagree.", 0],
    ],
  },
];

mp.events.add("client:quiz:showQuizData", (quiz_attempts) => {
  playerQuizAttempts = quiz_attempts;

  let QUIZ_QUESTIONS_1 = 1;
  let QUIZ_QUESTIONS_2 = 4;

  let ques_rnd1 = quiz_part_1;
  let ques_rnd2 = quiz_part_2;

  mp.gui.cursor.show(true, true);

  // mp.gui.chat.push(ques_rnd[0].answers[1][0]);
  //   mp.gui.chat.push("Length" + getRandomInt(0, ques_rnd.length - 1));

  for (let i = 0; i < QUIZ_QUESTIONS_1; i++) {
    // mp.gui.chat.push("error2 here");
    let rndm_ques_pos1 = getRandomInt(0, ques_rnd1.length - 1);

    chosen_questions.push({
      question: ques_rnd1[rndm_ques_pos1].question,
      answers: [
        ques_rnd1[rndm_ques_pos1].answers[0],
        ques_rnd1[rndm_ques_pos1].answers[1],
        ques_rnd1[rndm_ques_pos1].answers[2],
        ques_rnd1[rndm_ques_pos1].answers[3],
      ],
      //   correct: ques_rnd[rndm_ques_pos].correct,
    });
    // mp.gui.chat.push("error3 here");
    ques_rnd1.splice(rndm_ques_pos1, 1);
  }

  for (let i = 0; i < QUIZ_QUESTIONS_2; i++) {
    // mp.gui.chat.push("error2 here");
    let rndm_ques_pos2 = getRandomInt(0, ques_rnd2.length - 1);

    chosen_questions.push({
      question: ques_rnd2[rndm_ques_pos2].question,
      answers: [
        ques_rnd2[rndm_ques_pos2].answers[0],
        ques_rnd2[rndm_ques_pos2].answers[1],
        ques_rnd2[rndm_ques_pos2].answers[2],
        ques_rnd2[rndm_ques_pos2].answers[3],
      ],
    });
    // mp.gui.chat.push("error3 here");
    ques_rnd2.splice(rndm_ques_pos2, 1);
  }

  mp.gui.cef.execute(`
  quiz.loadQuiz('${JSON.stringify(chosen_questions)}');
  $('#reg_quiz__header').prepend('<div class="info-box-header-small" id = "reg_quiz__attempts" style="display: inline-block; margin-left: 650rem; font-size: 15rem">Total Attempts: ${playerQuizAttempts}</div>')
  `);

  setTimeout(() => mp.gui.cef.execute(`screen.show("quiz");`), 1000);
});

mp.events.add("client:quiz:hideRegQuiz", (status) => {
  mp.gui.cef.execute(`screen.hide("quiz");
  $("#reg_quiz__box").empty();
  `);
  if (status)
    mp.events.callRemote("server:quiz:quizPassed", playerQuizAttempts);
  else mp.events.callRemote("server:quiz:quizFailed", playerQuizAttempts);
});

// IC OOC RDM METAGAMING COPBAITING VDM SuitableRPName NLR
// Problem: GZ

// Combo 1: RDM, CopBaiting, NLR, IC
// Combo 2: PG, RDM, RP Name, IC, VDM
// Combo 3: IC RPName Fear-RP NLR PG
// Combo 4: Fear-RP, RPName, NLR, VDM, IC

mp.events.add("client:quiz:submitQuiz", (score) => {
  if (score < 10) {
    mp.gui.chat.push("Sorry you failed");
    mp.events.call("client:quiz:hideRegQuiz", false);
    // mp.gui.cef.execute(`quiz.close()`);

    // mp.events.callRemote("server:quiz:quizFailed", playerQuizAttempts);
  } else {
    mp.gui.cef.execute(`
    $("#reg_quiz__header_title").remove();
    $("#reg_quiz__attempts").remove();
    quiz.show("reg__quiz__box_success", "reg__quiz__box_4")`);
    // mp.events.callRemote("server:quiz:quizPassed", playerQuizAttempts);
  }
  // If Failed Kick Player. If Passed No need to show again.
});
