document.querySelector("#gameBtn").textContent = window.localStorage.getItem(
  "goal_glider"
)
  ? "Play Game"
  : "Choose learning path";

async function callIBMGranitModel(
  body,
  endpoint = "generateFilpTheTileQuestions"
) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    body,
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
  };

  return await fetch(
    `https://goalglider-server-shantiomlata-dev.apps.rm2.thpm.p1.openshiftapps.com/${endpoint}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((error) => {
      console.error(error);
      return {
        result: null,
        error: "IBM server error",
      };
    });
}

let environmentStartIndex,
  dataScienceStartIndex,
  historyStartIndex,
  roboticsStartIndex,
  mathStartIndex,
  dsaStartIndex = 0;

document.querySelector("#gameBtn").addEventListener("click", async (btn) => {
  if (window.localStorage.getItem("goal_glider")) {
    questionsAns = JSON.parse(
      window.localStorage.getItem("goal_glider")
    ).questionsAns;

    // set the isVisited tab of "questionAns" for bitGame
    for (questions in questionsAns["easy"]) {
      questionsAns["easy"][questions].isVisited = false;
    }

    // and for the Q&A game
    for (let paras in videoTracker) {
      videoTracker[paras].used = false;
    }

    // grabbing the start index count for the subjects
    const goal_glider = JSON.parse(window.localStorage.getItem("goal_glider"));
    environmentStartIndex = goal_glider.environmentStartIndex;
    dataScienceStartIndex = goal_glider.dataScienceStartIndex;
    historyStartIndex = goal_glider.historyStartIndex;
    dsaStartIndex = goal_glider.dsaStartIndex;
    roboticsStartIndex = goal_glider.roboticsStartIndex;
    mathStartIndex = goal_glider.mathStartIndex;

    letTheUserPlay();
  } else {
    if (btn.target.textContent == "Play Game") {
      document.querySelector("#loader").style.display = "block";
      btn.target.style.pointerEvents = "none";

      let AIGeneratedQuestions = {
        easy: {},
      };
      let questionsCount = 1;

      // use "IBM Granite" model to grab the questions acc to the subject
      for (let subject in subjectsArray) {
        document.body.style.pointerEvents = "none";

        showNotification(
          `Grabbing questions for <b>${subjectsArray[subject]}</b> via IBM Granite`
        );

        const modelOutput = await callIBMGranitModel(
          JSON.stringify({
            subject: subjectsArray[subject],
          })
        );

        if (modelOutput.result == null || modelOutput.error != null) {
          showNotification(
            "IBM API error occured! Try again",
            "rgba(255, 0, 0, 0.6)"
          );

          document.body.style.pointerEvents = "auto";
          btn.target.style.pointerEvents = "auto";
          window.localStorage.removeItem("goal_glider");
          document.querySelector("#loader").style.display = "none";
          return;
        }

        if (subjectsArray[subject] == "dataScience")
          dataScienceStartIndex = questionsCount;
        else if (subjectsArray[subject] == "environment")
          environmentStartIndex = questionsCount;
        else if (subjectsArray[subject] == "dsa")
          dsaStartIndex = questionsCount;
        else if (subjectsArray[subject] == "history")
          historyStartIndex = questionsCount;
        else if (subjectsArray[subject] == "robotics")
          roboticsStartIndex = questionsCount;
        else if (subjectsArray[subject] == "math")
          mathStartIndex = questionsCount;

        // save the questions correctly
        modelOutput.result.forEach((question, ind) => {
          AIGeneratedQuestions["easy"][questionsCount] = question;
          questionsCount++;
        });
      }

      // saving the questions and subjects in localStorage
      window.localStorage.setItem(
        "goal_glider",
        JSON.stringify({
          subjects: subjectsArray,
          questionsAns: AIGeneratedQuestions,
          dataScienceStartIndex,
          environmentStartIndex,
          dsaStartIndex,
          historyStartIndex,
          roboticsStartIndex,
          mathStartIndex,
        })
      );

      questionsAns = AIGeneratedQuestions;

      btn.target.style.pointerEvents = "auto";
      document.body.style.pointerEvents = "auto";
      document.querySelector("#loader").style.display = "none";

      letTheUserPlay();
    } else {
      document.querySelector("#gameBtn").textContent = "Play Game";
      document.querySelector("#gameBtn").style.pointerEvents = "none";

      // this is the thing called after use clicks "Play Game"
      document.querySelector("#ibmStartQuestions").style.display = "flex";
      document.querySelector("#letters").style.display = "none";
      document.querySelector("#full-form").style.display = "none";
      document.querySelector("#reasoning").style.display = "none";
    }
  }
});

function letTheUserPlay() {
  // grab the subjects
  let sub = JSON.parse(window.localStorage.getItem("goal_glider")).subjects;
  console.log(sub);

  // videoTracker = Object.fromEntries(
  //   Object.entries(videoTracker)
  //     .filter(([_, value]) => sub.includes(value.type))
  //     .map(([_, value], index) => [index, value])
  // );

  const entries = Object.entries(videoTracker)
    .map(([key, value], i) => ({ index: i, ...value }))
    .filter((item) => sub.includes(item.type));

  videoTracker = Object.fromEntries(
    entries.map((item, idx) => [
      idx,
      { type: item.type, used: item.used, videoQuestions: item.videoQuestions },
    ])
  );

  videoParas = entries.map((item) => videoParas[item.index]);

  sub.forEach((subject) => {
    if (subject == "environment") backImages.push("./img/environment.png");
    else if (subject == "dsa") backImages.push("./img/dsa.png");
    else if (subject == "history") backImages.push("./img/history.jpg");
    else if (subject == "math") backImages.push("./img/math.jpg");
    else if (subject == "robotics") backImages.push("./img/robotics.png");
    else if (subject == "dataScience") backImages.push("./img/dataScience.jpg");
  });

  // for "keydown" event (script.js), the cursor is being hidden (so show the cursor when the navigations keys are not pressed)
  setInterval(() => {
    document.body.style.cursor = "default";
  }, 2000);

  signupResult = {
    score: 0,
    flipLevel: 1,
    mazeLevel: 1,
    videoLevel: 1,
    username: "player",
  };

  document.querySelector(
    "#username"
  ).innerHTML = `👋 <span style="color: black">${signupResult.username}</span>`;

  videoLevels.textContent = signupResult.videoLevel;

  // setting up the variables for the game
  score = signupResult.score;

  document.querySelector("#overAllScore").innerHTML = signupResult.score;

  document.querySelector("#landing-section").style.display = "none";
  document.querySelector("#game").style.display = "block";
  document.querySelector("#tutorialImage").style.display = "none";
  document.getElementById("landing-section")?.remove();

  // change the "default" song styling
  document.querySelectorAll(`.musicOptions p`).forEach((music) => {
    music.style.background = "white";
  });

  document.querySelectorAll(`.musicOptions p`)[0].style.background =
    "rgba(76, 215, 26, 0.7)";

  movePlayer = true;

  controlMainSong(defaultSong, "play");
  attachMusicEventListeners();

  document.querySelector(".joystick-container").style.display = "flex";
  animate();
}

const atlassianBitbucketGame = document.querySelector(
  "div#atlassianBitbucketGame"
);
const atlassianJiraGame = document.querySelector("div#atlassianJiraGame");
const CANVAS = document.querySelector("canvas");
const ctx = CANVAS.getContext("2d");

const jiraCanvas = document.querySelector("#jiraGame");
const jiraCtx = jiraCanvas.getContext("2d");

const gameCanvas = document.querySelector("#gameCanvas");

// for larger screens (w=1024, h=576)
const width = (CANVAS.width = jiraCanvas.width = 310);
const height = (CANVAS.height = jiraCanvas.height = 310);

const playerSpeed = 4;
let currentActiveGame = "";

let villageCollisionMap = [];
// 50 for the old, & 95 for the new one (number of tiles in the map, width wise)
for (let i = 0; i < villageCollision.length; i += 95) {
  villageCollisionMap.push(villageCollision.slice(i, i + 95));
}

let mazeCollisionMap = [];
for (let i = 0; i < mazeColiision.length; i += 180) {
  mazeCollisionMap.push(mazeColiision.slice(i, i + 180));
}

const offset = {
  x: -2000,
  y: -1650,
};

const villageBoundaries = [];
villageCollisionMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol !== 0)
      villageBoundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
          isMaze: false,
          ctx,
        })
      );
  });
});

let mazeBoundaries = [];
let jiraLevelCoordinates = [
  [-1780, -1532],
  [-2300, -1936],
  [-3248, -1454],
  [-4200, -925],
  [-5168, -1455],
  [-6124, -1985],
];

const village = new Image();
village.src = "./img/village.png";

const maze = new Image();
maze.src = "./img/mazeMap.png";

const playerImage = new Image();
playerImage.src = "./img/playerDown.png";

const playerImageUp = new Image();
playerImageUp.src = "./img/playerUp.png";

const playerImageLeft = new Image();
playerImageLeft.src = "./img/playerLeft.png";

const playerImageRight = new Image();
playerImageRight.src = "./img/playerRight.png";

const player = new Sprite({
  position: {
    // 192*68 is the dimension of the playerDown.png
    x: CANVAS.width / 4 + 5,
    y: CANVAS.height / 2 + 100,
  },
  image: playerImage,
  frames: {
    max: 4,
    hold: 10,
  },
  sprites: {
    down: playerImage,
    up: playerImageUp,
    left: playerImageLeft,
    right: playerImageRight,
  },
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: village,
});

let mazeBackground;

const mazePlayer = new Sprite({
  position: {
    x: 150,
    y: 200,
  },
  image: playerImageLeft,
  frames: {
    max: 4,
    hold: 10,
  },
  sprites: {
    down: playerImage,
    up: playerImageUp,
    left: playerImageLeft,
    right: playerImageRight,
  },
  context: jiraCtx,
});

const keys = {
  up: { pressed: false },
  down: { pressed: false },
  left: { pressed: false },
  right: { pressed: false },
};

const villageMovables = [background, ...villageBoundaries];
let mazeMovables = [mazeBackground, ...mazeBoundaries];

const collisionDetection = ({ rect1, rect2 }) => {
  return (
    // for right side detection
    rect1.position.x + rect1.width >= rect2.position.x &&
    // for left side detection
    rect1.position.x <= rect2.position.x + rect2.width &&
    // for topside detection (upside)
    rect1.position.y <= rect2.position.y + rect2.height &&
    // for downside detection
    rect1.position.y + rect1.height >= rect2.position.y
  );
};

let insideRoom = false;
let jiraGameZone = false;
let videoGameZone = false;
let funFacts = false;
let bitbucketGameZone = false;

let detailsDiv = document.querySelector("div#homeDiv");

let jiraX = 0;
let jiraY = 0;

// function to control the player's movements
function navigatePlayer(playerType, movingBool, boundaryType, movableType) {
  if (keys.up.pressed && lastKey === "up") {
    playerType.image = playerType.sprites.up;
    playerType.animate = true;
    for (let i = 0; i < boundaryType.length; i++) {
      const boundary = boundaryType[i];
      if (
        collisionDetection({
          rect1: playerType,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + playerSpeed,
            },
          },
        })
      ) {
        movingBool = false;
        break;
      }
    }
    if (movingBool) {
      if (currentActiveGame == "jira") {
        jiraY++;
      }
      movableType.forEach((movable) => {
        movable.position.y += playerSpeed;
      });
    }
  } else if (keys.down.pressed && lastKey === "down") {
    playerType.image = playerType.sprites.down;
    playerType.animate = true;
    for (let i = 0; i < boundaryType.length; i++) {
      const boundary = boundaryType[i];
      if (
        collisionDetection({
          rect1: playerType,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - playerSpeed,
            },
          },
        })
      ) {
        movingBool = false;
        break;
      }
    }
    if (movingBool) {
      if (currentActiveGame == "jira") {
        jiraY--;
      }
      movableType.forEach((movable) => {
        movable.position.y -= playerSpeed;
      });
    }
  } else if (keys.left.pressed && lastKey === "left") {
    playerType.image = playerType.sprites.left;
    playerType.animate = true;
    for (let i = 0; i < boundaryType.length; i++) {
      const boundary = boundaryType[i];
      if (
        collisionDetection({
          rect1: playerType,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x + playerSpeed,
              y: boundary.position.y,
            },
          },
        })
      ) {
        movingBool = false;
        break;
      }
    }
    if (movingBool) {
      if (currentActiveGame == "jira") {
        jiraX++;
      }
      movableType.forEach((movable) => {
        movable.position.x += playerSpeed;
      });
    }
  } else if (keys.right.pressed && lastKey === "right") {
    playerType.image = playerType.sprites.right;
    playerType.animate = true;
    for (let i = 0; i < boundaryType.length; i++) {
      const boundary = boundaryType[i];
      if (
        collisionDetection({
          rect1: playerType,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x - playerSpeed,
              y: boundary.position.y,
            },
          },
        })
      ) {
        movingBool = false;
        break;
      }
    }
    if (movingBool) {
      if (currentActiveGame == "jira") {
        jiraX--;
      }
      movableType.forEach((movable) => {
        movable.position.x -= playerSpeed;
      });
    }
  }
}

// function to show detailed info about the house and keys to be pressed for further interactions
let houseName = "";
let showInfoString = "";
function showInfo() {
  if (
    background.position.x <= -2692 &&
    background.position.x >= -2728 &&
    background.position.y <= -1770 &&
    background.position.y >= -1794
  ) {
    return {
      showInfoString:
        "<b>Personal Room</b> <br>Click <b>S key</b> to see the stats",
      houseName: "personalHouse",
      result: true,
    };
  } else if (
    background.position.x <= -1660 &&
    background.position.x >= -1800 &&
    background.position.y <= -770 &&
    background.position.y >= -818
  ) {
    return {
      showInfoString: "Game #1 <br>Click <b>M  key</b> to play Maze Runner",
      houseName: "maze",
      result: true,
    };
  } else if (
    background.position.x <= -1648 &&
    background.position.x >= -1700 &&
    background.position.y <= -1242 &&
    background.position.y >= -1252
  ) {
    return {
      showInfoString:
        "<b>Game #2 </b> <br>Click <b>F key</b> to play Flip the Tiles",
      houseName: "bitbucket",
      result: true,
    };
  } else if (
    background.position.x <= -2176 &&
    background.position.x >= -2332 &&
    background.position.y <= -758 &&
    background.position.y >= -774
  ) {
    return {
      showInfoString: "<b>Game #4 </b> <br>Click <b>V key</b> to play Q&A",
      houseName: "video",
      result: true,
    };
  } else if (
    background.position.x <= -1856 &&
    background.position.x >= -2024 &&
    background.position.y <= -1638 &&
    background.position.y >= -1698
  ) {
    return {
      showInfoString:
        "<b>Career Fun Fact</b> <br>Click <b>G key</b> & see at the bottom of the screen",
      houseName: "funFacts",
      result: true,
    };
  } else return { result: false };
}

let hideKeys = false;

let animationId;
function animate() {
  // console.log(`X: ${background.position.x} Y: ${background.position.y}`);
  animationId = window.requestAnimationFrame(animate);
  background.draw();
  villageBoundaries.forEach((villageBoundary) => {
    villageBoundary.draw();
  });

  player.draw();

  let moving = true;
  player.animate = false;

  const travelToRoom = showInfo();

  insideRoom = false;
  jiraGameZone = false;
  videoGameZone = false;
  funFacts = false;
  bitbucketGameZone = false;

  if (travelToRoom.result) {
    // not allowing when the player is inside the games
    if (currentActiveGame) return;

    // show the keys section
    document.querySelector(".musicOptions").style.display = "none";
    hideKeys == false
      ? (document.querySelector(".keysOptions").style.display = "flex")
      : "";

    detailsDiv.innerHTML = travelToRoom.showInfoString;
    switch (travelToRoom.houseName) {
      case "personalHouse":
        insideRoom = true;
        break;
      case "maze":
        jiraGameZone = true;
        break;
      case "bitbucket":
        detailsDiv.innerHTML = travelToRoom.showInfoString;
        bitbucketGameZone = true;
        // }
        break;
      case "video":
        detailsDiv.innerHTML = travelToRoom.showInfoString;
        videoGameZone = true;
        // }
        break;
      case "funFacts":
        funFacts = true;
    }
  } else {
    detailsDiv.innerHTML = "";
    if (hideKeys == false) {
      document.querySelector(".keysOptions").style.display = "none";
      document.querySelector(".musicOptions").style.display = "flex";
    }
  }

  // navigatePlayer function call
  navigatePlayer(player, moving, villageBoundaries, villageMovables);
}

function lookoutForSmallScreens() {
  setInterval(() => {
    // doing the UI changes for the "q&a game"
    if (currentActiveGame == "thetaVideo") {
      // smaller screen devices
      if (window.innerWidth < 1200) {
        // answering the questions
        if (videoPlayer.style.display == "none") {
          videoQuestions.style.width = "85%";
          video.style.width = "15%";
        }
        // seeing the para (question)
        else if (qna.style.display == "none") {
          videoQuestions.style.width = "15%";
          video.style.width = "85%";
        }
        video.style.height = "90%";
        videoQuestions.style.height = "90%";
        video.style.alignItems =
          qna.style.display == "none" ? "flex-start" : "center";
      }
      // for larger screen devices
      else if (window.innerWidth >= 1200) {
        video.style.alignItems = "center";
        videoQuestions.style.height =
          qna.style.display == "none" ? "auto" : "90%";
        video.style.height =
          videoPlayer.style.display == "none" ? "auto" : "90%";
        videoQuestions.style.width = "50%";
        video.style.width = "50%";
      }
    }

    // for the flip the buckets game
    if (currentActiveGame == "bitbucket") {
      if (window.innerWidth < 1000) {
        document.documentElement.style.setProperty(
          "--bitCardDimensions",
          "90px"
        );
        document.querySelector("#bitbucketGameDiv").style.gap = "10px";

        // loop through the img tags under "lives"
        lives.style.flexDirection = "column";

        lives.style.marginRight = "10px";

        lives.querySelectorAll("img").forEach((heartImg) => {
          (heartImg.width = 20), (heartImg.height = 20);
        });

        levelInfo.textContent =
          levelTitles[currentLevel - 1].slice(0, 8) + "...";
        currentPairMade.style.display = "none";
        currentDifficultyUI.style.display = "none";
      } else {
        levelInfo.textContent = levelTitles[currentLevel - 1].slice(
          0,
          levelTitles[currentLevel - 1].length
        );

        lives.style.flexDirection = "row";

        lives.querySelectorAll("img").forEach((heartImg) => {
          (heartImg.width = 45), (heartImg.height = 45);
        });

        currentPairMade.style.display = "block";
        currentDifficultyUI.style.display = "block";
        document.documentElement.style.setProperty(
          "--bitCardDimensions",
          "140px"
        );
        document.querySelector("#bitbucketGameDiv").style.gap = "";
      }
    }
  }, 50);
}

function changeCanvasDimensions() {
  setInterval(() => {
    if (window.innerWidth < 1200) {
      document.querySelectorAll("canvas").forEach((canvas) => {
        canvas.width = 310;
        canvas.height = 350;
      });
    } else {
      document.querySelectorAll("canvas").forEach((canvas) => {
        canvas.width = 1024;
        canvas.height = 576;
      });
    }
  }, 300);
}

changeCanvasDimensions();
lookoutForSmallScreens();

function initBitbucketGame() {
  weeklyRewards.style.display = "none";

  document.querySelector(".joystick-container").style.display = "none";
  document.querySelector(".musicOptions").style.display = "none";

  // calling the function that will start the setup for bitbucketGame
  initializeLevel({ level: signupResult.flipLevel });
  document.querySelector("body").style.background =
    "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('./img/bgd.jpg')";
  document.querySelector("body").style.backgroundPosition = "center";
  document.querySelector("body").style.backgroundRepeat = "no-repeat";
  document.querySelector("body").style.backgroundSize = "cover";
  document.querySelector("body").style.height = "100vh";
  document.querySelector("body").style.overflow = "hidden";

  if (muteUnmuteIcon.src.includes("volume_up.png")) bitGameSong.play();

  playedBitbucketGame = true;
  currentActiveGame = "bitbucket";
  CANVAS.style.display = "none";
  gameCanvas.style.display = "none";

  detailsDiv.style.display = "none";
  atlassianBitbucketGame.style.display = "flex";
  document.querySelector("#username").style.display = "none";
}

const jiraLevelsArray = {
  1: {
    x: -2288,
    y: {
      first: -1916,
      second: -1936,
    },
    duration: 60,
  },
  2: {
    x: -3248,
    y: {
      first: -1436,
      second: -1456,
    },
    duration: 60,
  },
  3: {
    x: -4200,
    y: {
      first: -908,
      second: -928,
    },
    duration: 60,
  },
  4: {
    x: -5168,
    y: {
      first: -1436,
      second: -1456,
    },
    duration: 60,
  },
  5: {
    x: -6124,
    y: {
      first: -1964,
      second: -1984,
    },
    duration: 40,
  },
  6: {
    x: -6996,
    y: {
      first: -1964,
      second: -1984,
    },
    duration: 40,
  },
};

let mazeId;
let intervalName;
let countdownTimer;
let currentJiraLevel = 0;
let passedAllJiraLevels = false;
let timeJira = document.querySelector("#timeJira");
let levelJira = document.querySelector("#levelJira");

let weeklyRewards = document.querySelector("#weeklyRewards");

function initJiraGame() {
  currentActiveGame = "jira";
  CANVAS.style.display = "none";
  timeJira.style.display = "block";
  levelJira.style.display = "block";
  gameCanvas.style.display = "none";
  weeklyRewards.style.display = "none";

  // checking for the levels
  if (signupResult.mazeLevel > 6) passedAllJiraLevels = true;

  if (passedAllJiraLevels) {
    document.querySelector("#clearedJiraLevels").style.display = "block";
    atlassianJiraGame.style.display = "block";

    levelJira.innerHTML = `6/6`;
    return;
  }

  mazeBackground = new Sprite({
    position: {
      x: jiraLevelCoordinates[signupResult.mazeLevel - 1][0],
      y: jiraLevelCoordinates[signupResult.mazeLevel - 1][1],
    },
    image: maze,
    context: jiraCtx,
  });

  mazeCollisionMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol !== 0)
        mazeBoundaries.push(
          new Boundary({
            position: {
              x:
                j * Boundary.width +
                jiraLevelCoordinates[signupResult.mazeLevel - 1][0],
              y:
                i * Boundary.height +
                jiraLevelCoordinates[signupResult.mazeLevel - 1][1],
            },
            isMaze: true,
            ctx: jiraCtx,
          })
        );
    });
  });

  mazeBackground.position = {
    x: jiraLevelCoordinates[signupResult.mazeLevel - 1][0],
    y: jiraLevelCoordinates[signupResult.mazeLevel - 1][1],
  };

  currentJiraLevel = signupResult.mazeLevel - 1;

  mazeMovables = [mazeBackground, ...mazeBoundaries];

  countdownTimer = jiraLevelsArray[currentJiraLevel + 1].duration;

  levelJira.innerHTML = `Level:<br> <b>0${signupResult.mazeLevel}/06</b>`;

  intervalName = setInterval(changeTimer, 1000);
  jiraCanvas.style.display = "block";
  atlassianJiraGame.style.display = "flex";
  initiateMaze();
}

function checkLevel(x, y) {
  if (passedAllJiraLevels) return;

  if (
    currentJiraLevel < 5 &&
    x <= jiraLevelsArray[currentJiraLevel + 1].x &&
    (y <= jiraLevelsArray[currentJiraLevel + 1].y.first ||
      y <= jiraLevelsArray[currentJiraLevel + 1].y.second)
  ) {
    incScore("5");

    levelJira.innerHTML = `Level:<br> <b>0${currentJiraLevel + 2}/06</b>`;
    signupResult.mazeLevel++;
    currentJiraLevel++;

    (jiraX = 0), (jiraY = 0);

    mazeBackground.position = {
      x: jiraLevelCoordinates[signupResult.mazeLevel - 1][0],
      y: jiraLevelCoordinates[signupResult.mazeLevel - 1][1],
    };

    if (currentJiraLevel <= 5) {
      countdownTimer = jiraLevelsArray[currentJiraLevel + 1].duration;
    }
    clearInterval(intervalName);
    intervalName = setInterval(changeTimer, 1000);
  } else if (
    currentJiraLevel >= 5 &&
    x <= jiraLevelsArray[6].x &&
    (y <= jiraLevelsArray[6].y.first || y <= jiraLevelsArray[6].y.second)
  ) {
    levelJira.innerHTML = `6/6`;

    incScore("5");
    showNotification("Hurray 🥳, you completed all 6 levels");

    clearInterval(intervalName);
    passedAllJiraLevels = true;

    signupResult.mazeLevel++;
    currentJiraLevel++;

    // changing the UI in 5 seconds
    setTimeout(() => {
      document.querySelector("#clearedJiraLevels").style.display = "block";
      jiraCanvas.style.display = "none";
    }, 2500);
  }
}

function initiateMaze() {
  checkLevel(mazeBackground.position.x, mazeBackground.position.y);
  directToTheExit({
    x: mazeBackground.position.x,
    y: mazeBackground.position.y,
  });

  // console.log(
  //   `X: ${mazeBackground.position.x} Y: ${mazeBackground.position.y}`
  // );
  mazeId = requestAnimationFrame(initiateMaze);

  mazeBackground.draw();

  mazeBoundaries.forEach((mazeBoundary) => {
    mazeBoundary.draw();
  });

  mazePlayer.draw();

  let moving = true;
  mazePlayer.animate = false;
  navigatePlayer(mazePlayer, moving, mazeBoundaries, mazeMovables);
}

function changeTimer() {
  timeJira.textContent =
    countdownTimer < 10 ? `0${countdownTimer}` : countdownTimer;

  countdownTimer--;
  if (countdownTimer < 0) {
    clearInterval(intervalName);

    showNotification(
      "Sorry, the time is over. Try again",
      "rgba(255, 0, 0, 0.6)"
    );

    // increasing the count
    personalHomeStats.runOutOfTime++;

    // decreasing the score
    incScore("-2");

    countdownTimer = 60;
    // GREAT EXECUTION (ALMOST UNBELIEVABLE TO ACHIEVE THIS)
    mazeMovables.forEach((movable) => {
      if (jiraY != 0) {
        movable.position.y = movable.position.y - playerSpeed * jiraY;
      }
      if (jiraX != 0) {
        movable.position.x = movable.position.x - playerSpeed * jiraX;
      }
    });

    jiraX = 0;
    jiraY = 0;
    currentJiraLevel = signupResult.mazeLevel - 1;
    intervalName = setInterval(changeTimer, 1000);

    countdownTimer = jiraLevelsArray[currentJiraLevel + 1].duration;
    levelJira.innerHTML = `Level:<br> <b>0${signupResult.mazeLevel}/06</b>`;
  }
}

let lastKey = "";
window.addEventListener("keydown", (e) => {
  if (movePlayer) {
    switch (e.key) {
      case "ArrowUp":
        document.body.style.cursor = "none";
        keys.up.pressed = true;
        lastKey = "up";
        break;
      case "ArrowDown":
        document.body.style.cursor = "none";
        keys.down.pressed = true;
        lastKey = "down";
        break;
      case "ArrowLeft":
        document.body.style.cursor = "none";
        keys.left.pressed = true;
        lastKey = "left";
        break;
      case "ArrowRight":
        document.body.style.cursor = "none";
        keys.right.pressed = true;
        lastKey = "right";
        break;
    }
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowUp":
      keys.up.pressed = false;
      break;
    case "ArrowDown":
      keys.down.pressed = false;
      break;
    case "ArrowLeft":
      keys.left.pressed = false;
      break;
    case "ArrowRight":
      keys.right.pressed = false;
      break;
  }
});

const exitVideoGame = () => {
  const tags = [
    "robotics",
    "environment",
    "history",
    "math",
    "dsa",
    "dataScience",
  ];
  tags.forEach((el) => {
    document.querySelector(`#${el}`).style.display = "none";
  });
  clearInterval(qnaInterval);
  clearInterval(videoInterval);

  movePlayer = true;
  document.querySelector("#thetaGame").style.display = "none";
  document.querySelector("#game").style.display = "block";
  if (document.querySelector("iframe")) {
    document.querySelector("iframe").remove();
  }
  correct.style.display = "none";
  wrong.style.display = "none";
  instructions.style.display = "block";

  proceedBtn.textContent = "Proceed";
  document.querySelector(".musicOptions").style.display = "flex";
};

// joystick controller
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("click", (e) => {
    const key = e.target.id.toLowerCase();
    muteUnmuteIcon.style.display = "none";

    if (jiraGameZone && key === "m") {
      cancelAnimationFrame(animationId);
      document.querySelector("#leftSideDiv").style.flexDirection = "column";
      initJiraGame();
    } else if (bitbucketGameZone && key === "f") {
      initBitbucketGame();
      movePlayer = false;
    } else if (videoGameZone && key === "v") {
      document.querySelector(".musicOptions").style.display = "none";

      movePlayer = false;
      document.querySelector("#score").textContent =
        document.querySelector("#overAllScore").textContent;
      document.querySelector("#game").style.display = "none";
      document.querySelector("#thetaGame").style.display = "block";

      currentActiveGame = "thetaVideo";

      video.style.display = "none";
      videoQuestions.style.display = "none";
      startDiv.style.display = "flex";
    } else if (insideRoom && key === "s") {
      muteUnmuteIcon.style.display = "block";

      document.querySelector(".musicOptions").style.display = "none";
      document.querySelector("#finalStats").style.display = "block";

      hideKeys = true;
      document.querySelector(".keysOptions").style.display = "none";

      document.querySelector(
        "#finalStats"
      ).innerHTML = `<span style="color: green">${personalHomeStats.easyBitPair}</span> easy triplets,
        <span style="color: green">${personalHomeStats.wrongBitPair}</span> wrong
        triplets, <span style="color: green">${currentJiraLevel}</span> level(s)
        in Maze,
        <span style="color: green">${videoLevelsPlayed}</span> level(s) in
        Q&A,
        <span style="color: green">${personalHomeStats.runOutOfTime}</span> time(s)
        you ran out of time`;

      setTimeout(() => {
        hideKeys = false;
        document.querySelector("#finalStats").style.display = "none";
        document.querySelector(".musicOptions").style.display = "flex";
      }, 5000);
    } else if (funFacts && key === "g") {
      muteUnmuteIcon.style.display = "block";
      let funFactsArray = [
        "<b>Careers evolve:</b> Many jobs today didn’t exist 10 years ago—adaptability matters",
        "<b>Passion matters:</b> People who enjoy their work perform better and stay longer",
        "<b>Soft skills are key:</b> Communication, problem-solving, and teamwork are valued across industries",
        "<b>Tech isn't just coding:</b> Careers in design, product, and research are equally crucial",
        "<b>Internships open doors:</b> Real-world experience often leads to job offers",
        "<b>Career paths aren’t linear:</b> Shifting roles and industries is common and acceptable",
        "<b>Curiosity drives growth:</b> Lifelong learners often advance faster in their careers",
        "<b>Networking works:</b> Most jobs are found through personal or professional connections",
        "<b>Side projects matter:</b> They showcase initiative and problem-solving beyond academics",
        "<b>Failure teaches more:</b> Mistakes help refine goals and build resilience",
        "<b>AI can’t replace all:</b> Creative and strategic roles still need the human mind",
        "<b>Your career is yours:</b> Define success on your terms, not others’ expectations",
        "<b>Certifications help:</b> Short courses or credentials can boost your profile quickly",
        "<b>Freelancing is viable:</b> Many professionals build full-time careers working independently",
        "<b>You’re not late:</b> It’s never too early or too late to explore a new path",
      ];

      document.querySelector("#finalStats").style.display = "block";
      document.querySelector("#finalStats").innerHTML =
        funFactsArray[Math.floor(Math.random() * 15)];
      document.querySelector(".musicOptions").style.display = "none";
      hideKeys = true;
      document.querySelector(".keysOptions").style.display = "none";

      setTimeout(() => {
        hideKeys = false;
        document.querySelector(".musicOptions").style.display = "flex";
        document.querySelector("#finalStats").style.display = "none";
      }, 5000);
    } else muteUnmuteIcon.style.display = "block";

    // for backspace to exit a game
    if (
      key === "backspace" &&
      document.querySelector("#levelsCompletedDiv").style.display == "none"
    ) {
      if (currentActiveGame === "thetaVideo") exitVideoGame();
      else if (currentActiveGame === "bitbucket") exitBitGame();
      else if (currentActiveGame === "jira") {
        movePlayer = true;

        document.querySelector("#leftSideDiv").style.flexDirection =
          "column-reverse";

        weeklyRewards.style.display = "flex";
        directionArrow.style.display = "none";

        if (!passedAllJiraLevels) {
          jiraX = 0;
          jiraY = 0;

          clearInterval(intervalName);
          cancelAnimationFrame(mazeId);

          // to reset the levels
          (mazeBackground = null), (mazeBoundaries = []);

          atlassianJiraGame.style.display = "none";
        } else {
          atlassianJiraGame.style.display = "flex";
        }

        timeJira.style.display = "none";
        levelJira.style.display = "none";
        gameCanvas.style.display = "flex";

        animate();
      } else return;

      currentActiveGame = "";
      jiraCanvas.style.display = "none";
      CANVAS.style.display = "inline-block";
      muteUnmuteIcon.style.display = "block";
      detailsDiv.style.display = "inline-block";
      atlassianJiraGame.style.display = "none";
    }
  });
});

const joystick = document.querySelector(".joystick");
const container = document.querySelector(".joystick-container");

let centerX = container.offsetWidth / 2;
let centerY = container.offsetHeight / 2;
// Restrict joystick movement radius
const maxDistance = 20;

container.addEventListener("touchmove", moveJoystick);
container.addEventListener("mousemove", moveJoystick);
container.addEventListener("touchend", resetJoystick);
container.addEventListener("mouseleave", resetJoystick);
container.addEventListener("mouseup", resetJoystick);

function moveJoystick(event) {
  event.preventDefault();

  // Get bounding box for accurate positioning
  const rect = container.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  let x, y;

  if (event.touches) {
    x = event.touches[0].clientX - rect.left;
    y = event.touches[0].clientY - rect.top;
  } else {
    x = event.clientX - rect.left;
    y = event.clientY - rect.top;
  }

  let deltaX = x - centerX;
  let deltaY = y - centerY;

  // Restrict movement within maxDistance radius
  const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
  if (distance > maxDistance) {
    deltaX = (deltaX / distance) * maxDistance;
    deltaY = (deltaY / distance) * maxDistance;
  }

  joystick.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

  // Simulate arrow key presses with lastKey tracking
  keys.up.pressed = deltaY < -5;
  keys.down.pressed = deltaY > 5;
  keys.left.pressed = deltaX < -5;
  keys.right.pressed = deltaX > 5;

  if (keys.up.pressed) lastKey = "up";
  if (keys.down.pressed) lastKey = "down";
  if (keys.left.pressed) lastKey = "left";
  if (keys.right.pressed) lastKey = "right";
}

function resetJoystick() {
  joystick.style.transition = "transform 0.1s ease-out";
  joystick.style.transform = "translate(0, 0)";

  // Ensure keys are properly reset
  keys.up.pressed = false;
  keys.down.pressed = false;
  keys.left.pressed = false;
  keys.right.pressed = false;
  lastKey = "";

  // Force reflow (Fixes visual glitches)
  joystick.offsetHeight;

  // Remove transition after reset to avoid unwanted delays
  setTimeout(() => {
    joystick.style.transition = "none";
  }, 100);
}

const directionArrow = document.querySelector("#maze-direction-image");

// for the maze runner direction
function directToTheExit(currentCoordinates) {
  directionArrow.style.display = "block";

  const finalCoordinates = {
    x: jiraLevelsArray[currentJiraLevel + 1].x,
    y: jiraLevelsArray[currentJiraLevel + 1].y.first,
    y2: jiraLevelsArray[currentJiraLevel + 1].y.second,
  };

  const dx = finalCoordinates.x - currentCoordinates.x;
  const dy = finalCoordinates.y - currentCoordinates.y;

  const inYRange =
    currentCoordinates.y >= Math.min(finalCoordinates.y, finalCoordinates.y2) &&
    currentCoordinates.y <= Math.max(finalCoordinates.y, finalCoordinates.y2);

  const inXRange =
    currentCoordinates.x >= finalCoordinates.x - 20 &&
    currentCoordinates.x <= finalCoordinates.x + 20;

  // Prioritize straight directions first
  if (dx < 0 && inYRange) directionArrow.src = "img/arrow-right.png";
  else if (dx > 0 && inYRange) directionArrow.src = "img/arrow-left.png";
  else if (dx === 0 && dy < 0 && inXRange)
    directionArrow.src = "img/arrow-down.png";
  else if (dx === 0 && dy > 0 && inXRange)
    directionArrow.src = "img/arrow-up.png";
  // Diagonal directions
  else if (dx > 0 && dy > 0) directionArrow.src = "img/arrow-nw.png";
  else if (dx > 0 && dy < 0) directionArrow.src = "img/arrow-sw.png";
  else if (dx < 0 && dy > 0) directionArrow.src = "img/arrow-ne.png";
  else if (dx < 0 && dy < 0) directionArrow.src = "img/arrow-se.png";
}

// to mute/unmute music background
muteUnmuteIcon.addEventListener("click", (e) => {
  if (e.target.src.includes("volume_up.png")) {
    e.target.src = "img/volume_mute.png";
    mainSong.pause();
  } else {
    e.target.src = "img/volume_up.png";
    mainSong.play();
  }
});

document.querySelector("#weeklyRewards").addEventListener("click", () => {
  populateModal("Career Guidance", []);
  toggleClasses.forEach((el) => el.classList.toggle("hidden"));
});

// to reset the game
document.querySelector("#resetGame").addEventListener("click", () => {
  showNotification("Resetting the game in 2 seconds", "rgba(255, 0, 0, 0.6)");
  window.localStorage.removeItem("goal_glider");
  setInterval(() => {
    window.location.reload();
  }, 2000);
});
