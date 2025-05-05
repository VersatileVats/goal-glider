function changeCSSVar(properties) {
  let r = document.querySelector(":root");
  for (const key in properties) {
    r.style.setProperty(`--${key}`, `${properties[key]}`);
  }
}
let propertiesToBeChanged = {
  gridSize: 5,
  width: "70vw",
};

let selectedTiles = [];
let currentlyFlipped = [];

let currentDifficulty;
let levelDataArray;
let currentLevel;
let useHintOnce;
let levelData;

let gameCompleted = false;

let initSettings = {
  easy: {
    maxValue: 3,
    width: "40vw",
    tiles: 9,
  },
  hard: {
    maxValue: 5,
    width: "70vw",
    tiles: 15,
  },
};

// UI element which will show the correct no of pairs made in the current level
let currentPairMade = document.querySelector("#currentPairMade");
let currentDifficultyUI = document.querySelector("#currentDifficultyUI");
let currentPairMadeCount;

const lives = document.querySelector("#lives");
const levelInfo = document.querySelector("#levelInfo");
const backToHome = document.querySelector("#backToHome");
const helpBitbucket = document.querySelector("#helpBitbucket");

const levelTitles = [
  "1: Start with basics",
  "2: Onto the next one",
  "3: Getting hard",
  "4. 5X3 showdown",
  "5: Beat if you can",
];

let backImages = [];

const colorShades = {
  bit1: "#83d32c",
  bit2: "#045b7c",
  bit3: "#04b3cb",
  bit4: "#13335b",
  bit5: "#ec1b4b",
};

// object for showing the overall scores in the PLAYER's personal house
let personalHomeStats = {
  easyBitPair: 0,
  hardBitPair: 0,
  wrongBitPair: 0,
  runOutOfTime: 0,
};

let questionsAns = {};

// helper functions
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function isDuplicate(el) {
  let flag = false;
  currentlyFlipped.forEach((div) => {
    if (div == el) flag = true;
  });
  return flag;
}

function findIndex(arr, el) {
  let ans = "";
  ans = arr.findIndex((data) => data == el);
  return ans;
}

function populateLevelData() {
  // choose a random image from the backImages
  let imageType = backImages[randomNumber(0, 3)].split("/")[2].split(".")[0];

  let existsInObj = false;
  for (data in levelData) {
    if (data == imageType) {
      existsInObj = true;
      break;
    }
  }

  if (!existsInObj) levelData[imageType] = { value: 0 };

  for (questions in questionsAns[currentDifficulty]) {
    let randomIndex;
    switch (imageType) {
      case "dsa":
        console.log("DSA RANDOM NUMBER" + dsaStartIndex);
        randomIndex =
          currentDifficulty === "easy"
            ? randomNumber(dsaStartIndex, dsaStartIndex + 9)
            : randomNumber(1, 26);
        break;
      case "environment":
        console.log("ENV RANDOM NUMBER" + environmentStartIndex);
        randomIndex =
          currentDifficulty === "easy"
            ? randomNumber(environmentStartIndex, environmentStartIndex + 9)
            : randomNumber(26, 51);
        break;
      case "dataScience":
        console.log("DS RANDOM NUMBER" + dataScienceStartIndex);
        randomIndex =
          currentDifficulty === "easy"
            ? randomNumber(dataScienceStartIndex, dataScienceStartIndex + 9)
            : randomNumber(51, 76);
        break;
      case "robotics":
        console.log("ROB RANDOM NUMBER" + roboticsStartIndex);
        randomIndex =
          currentDifficulty === "easy"
            ? randomNumber(roboticsStartIndex, roboticsStartIndex + 9)
            : randomNumber(76, 101);
        break;
      case "math":
        console.log("Math RANDOM NUMBER" + mathStartIndex);
        randomIndex =
          currentDifficulty === "easy"
            ? randomNumber(mathStartIndex, mathStartIndex + 9)
            : randomNumber(101, 126);
        break;
      case "history":
        console.log("History RANDOM NUMBER" + historyStartIndex);
        randomIndex =
          currentDifficulty === "easy"
            ? randomNumber(historyStartIndex, historyStartIndex + 9)
            : randomNumber(101, 126);
        break;
    }
    let curr = questionsAns[currentDifficulty][randomIndex];
    console.log(randomIndex);
    console.log(questionsAns[currentDifficulty][randomIndex]);

    if (!curr.isVisited && curr.value.includes(imageType)) {
      curr.isVisited = true;

      levelData[imageType][levelData[imageType].value++] =
        curr.value.split(".")[1];
      levelData[imageType][levelData[imageType].value++] =
        curr.value.split(".")[2];

      break;
    }
  }
}

// populating the LEVELDATA array according to the tileset and other attributes
function populateLevelDataArray() {
  for (data in levelData) {
    for (let j = 0; j < levelData[data].value; j++) {
      levelDataArray.push(levelData[data][j]);
    }
    for (let j = 0; j < levelData[data].value / 2; j++) {
      switch (data) {
        case "dsa":
          levelDataArray.push("./img/dsa.png");
          break;
        case "environment":
          levelDataArray.push("./img/environment.png");
          break;
        case "dataScience":
          levelDataArray.push("./img/dataScience.jpg");
          break;
        case "robotics":
          levelDataArray.push("./img/robotics.png");
          break;
        case "math":
          levelDataArray.push("./img/math.jpg");
          break;
        case "history":
          levelDataArray.push("./img/history.jpg");
          break;
      }
    }
  }
}

function findEleIndex(str) {
  return correctOrderAnsArray.findIndex((el) => el.includes(str));
}

let arrayForHints = [];
let correctOrderAnsArray = [];

function makeHintsArray() {
  let imageIndex = findEleIndex("./img");

  switch (imageIndex) {
    case 2:
      if (correctOrderAnsArray[5].includes("./img")) {
        arrayForHints.push(
          `${correctOrderAnsArray[0]}-${correctOrderAnsArray[1]}-${correctOrderAnsArray[2]}`
        );
        arrayForHints.push(
          `${correctOrderAnsArray[3]}-${correctOrderAnsArray[4]}-${correctOrderAnsArray[5]}`
        );
        arrayForHints.push(
          `${correctOrderAnsArray[6]}-${correctOrderAnsArray[7]}-${correctOrderAnsArray[8]}`
        );
      } else {
        arrayForHints.push(
          `${correctOrderAnsArray[0]}-${correctOrderAnsArray[1]}-${correctOrderAnsArray[2]}`
        );
        arrayForHints.push(
          `${correctOrderAnsArray[3]}-${correctOrderAnsArray[4]}-${correctOrderAnsArray[7]}`
        );
        arrayForHints.push(
          `${correctOrderAnsArray[5]}-${correctOrderAnsArray[6]}-${correctOrderAnsArray[8]}`
        );
      }
      break;

    case 4:
      arrayForHints.push(
        `${correctOrderAnsArray[0]}-${correctOrderAnsArray[1]}-${correctOrderAnsArray[4]}`
      );
      arrayForHints.push(
        `${correctOrderAnsArray[2]}-${correctOrderAnsArray[3]}-${correctOrderAnsArray[5]}`
      );
      arrayForHints.push(
        `${correctOrderAnsArray[6]}-${correctOrderAnsArray[7]}-${correctOrderAnsArray[8]}`
      );
      break;

    case 6:
      arrayForHints.push(
        `${correctOrderAnsArray[0]}-${correctOrderAnsArray[1]}-${correctOrderAnsArray[6]}`
      );
      arrayForHints.push(
        `${correctOrderAnsArray[2]}-${correctOrderAnsArray[3]}-${correctOrderAnsArray[7]}`
      );
      arrayForHints.push(
        `${correctOrderAnsArray[4]}-${correctOrderAnsArray[5]}-${correctOrderAnsArray[8]}`
      );
      break;
  }
}

// the magic section: where the UI will be populated accordingly
function updateUI() {
  const bitbucketGameDiv = document.querySelector("#bitbucketGameDiv");
  if (currentDifficulty == "easy") {
    correctOrderAnsArray = [...levelDataArray];
    makeHintsArray();
  }

  levelDataArray = shuffle(shuffle(levelDataArray));

  for (let k = 0; k < levelDataArray.length; k++) {
    const randomNo = randomNumber(1, 6);
    const bitbucketGameDiv = document.querySelector("#bitbucketGameDiv");

    const bitCard = document.createElement("div");
    bitCard.classList.add("bitCard");
    bitbucketGameDiv.appendChild(bitCard);

    const bitCardInner = document.createElement("div");
    bitCardInner.classList.add("bit-card-inner");
    bitCardInner.setAttribute("id", `card${k}`);
    bitCard.appendChild(bitCardInner);

    const bitCardFront = document.createElement("div");
    bitCardFront.classList.add("bit-card-front");
    bitCardInner.appendChild(bitCardFront);

    const image = document.createElement("img");
    image.src = `./img/bit${randomNo}.png`;
    bitCardFront.appendChild(image);

    const bitCardBack = document.createElement("div");
    bitCardBack.classList.add("bit-card-back");
    bitCardBack.style.backgroundColor = colorShades[`bit${randomNo}`];
    bitCardInner.appendChild(bitCardBack);

    if (levelDataArray[k].includes("./")) {
      const mainContent = document.createElement("img");
      mainContent.width = 160;
      mainContent.height = 160;
      mainContent.src = levelDataArray[k];
      bitCardBack.appendChild(mainContent);
    } else {
      const mainContent = document.createElement("h4");
      mainContent.innerHTML = levelDataArray[k];
      bitCardBack.appendChild(mainContent);
    }
  }
}

// in case the matched pairs are wrong, then do reverse the UI changes
function resetSelections() {
  // totalLives = 3
  selectedTiles.forEach((divNo) => {
    let div = document.querySelector(`#card${divNo}`);

    div.style.border = "none";

    div.firstElementChild.classList.add("bit-card-front");
    div.firstElementChild.classList.remove("bit-card-back");
    div.lastElementChild.classList.remove("bit-card-front");
    div.lastElementChild.classList.add("bit-card-back");
    div.style.pointerEvents = "all";
  });
  selectedTiles = [];
  currentlyFlipped = [];
}

function resetImpVariables() {
  arrayForHints = [];
  selectedTiles = [];
  currentlyFlipped = [];
  correctOrderAnsArray = [];
}

function initializeUISelection() {
  document.querySelectorAll(".bit-card-inner").forEach((node) => {
    node.addEventListener("click", async () => {
      node.style.borderRadius = "10px";
      node.style.border = "3px dashed orange";

      // ensuring that it allows to click till the point all the tiles are not matched
      if (
        currentlyFlipped.length <= 2 &&
        !isDuplicate(node.id) &&
        currentPairMadeCount < initSettings[currentDifficulty].maxValue
      ) {
        // check whether the lastElementChild is having an img or not
        if (node.lastElementChild.firstElementChild.src !== undefined) {
          let imageType;
          if (node.lastElementChild.firstElementChild.src.includes("dsa.png")) {
            imageType = "dsaImage";
          } else if (
            node.lastElementChild.firstElementChild.src.includes(
              "environment.png"
            )
          ) {
            imageType = "environmentImage";
          } else if (
            node.lastElementChild.firstElementChild.src.includes("history.jpg")
          ) {
            imageType = "historyImage";
          } else if (
            node.lastElementChild.firstElementChild.src.includes("math.jpg")
          ) {
            imageType = "mathImage";
          } else if (
            node.lastElementChild.firstElementChild.src.includes("robotics.png")
          ) {
            imageType = "roboticsImage";
          } else if (
            node.lastElementChild.firstElementChild.src.includes(
              "dataScience.jpg"
            )
          ) {
            imageType = "dataScienceImage";
          }
          currentlyFlipped.push(imageType);
          // alert("iMAGE URL IS: " + node.lastElementChild.firstElementChild.src)
        } else {
          currentlyFlipped.push(
            node.lastElementChild.firstElementChild.innerHTML.toLowerCase()
          );
          // alert("TEXT CONTENT IS: " + node.lastElementChild.firstElementChild.innerHTML.toLowerCase())
        }
        // gives the card number that is being clicked on
        selectedTiles.push(node.id.split("d")[1]);
        // alert(selectedTiles)
        // alert(currentlyFlipped)

        // swapping the front and back of the card
        node.firstElementChild.classList.remove("bit-card-front");
        node.firstElementChild.classList.add("bit-card-back");
        node.lastElementChild.classList.add("bit-card-front");
        node.lastElementChild.classList.remove("bit-card-back");
        node.style.pointerEvents = "none";

        // first item is being pushed,so make the help section visible so that the user can get the answer
        if (
          currentlyFlipped.length == 1 &&
          currentDifficulty == "easy" &&
          useHintOnce
        ) {
          helpBitbucket.style.pointerEvents = "all";

          helpBitbucket.addEventListener("click", async () => {
            let traverseUIElements = document.querySelectorAll(".bitCard");
            for (
              let el = 0;
              el < traverseUIElements.length && useHintOnce;
              el++
            ) {
              let text = "";
              for (let k = 0; k < currentlyFlipped.length; k++) {
                if (currentlyFlipped[k].includes("Image"))
                  text = `${text}-${currentlyFlipped[k].split("I")[0]}`;
                else text = text + "-" + currentlyFlipped[k];
              }

              let split = text.split("-");

              let hintText = "";
              let hintTextArray = [];

              // arrayForHints: [ "b2-c2-./img/bitbucket.png", "b4-c4-./img/bitbucket.png", "j3-k3-./img/jira.png" ]
              let res = false;
              for (let x = 0; x < arrayForHints.length; x++) {
                if (arrayForHints[x].includes(split[1])) {
                  res = true;
                  hintText += arrayForHints[x];
                  break;
                }
              }

              hintTextArray = hintText.split("-");
              let hintContent = "";
              for (let i = 0; i < hintTextArray.length; i++) {
                if (hintTextArray[i].includes(split[1])) {
                  if (i == 0) hintContent = hintTextArray[1];
                  else if (i == 1) hintContent = hintTextArray[0];
                  else hintContent = hintTextArray[0];
                }
                if (hintContent != "") break;
              }
              let childNode =
                traverseUIElements[el].firstChild.lastChild.firstChild;
              if (
                (childNode.src == undefined &&
                  childNode.innerHTML === hintContent) ||
                (childNode.src != undefined &&
                  childNode.src.includes(hintContent))
              ) {
                document.querySelector(
                  `#${traverseUIElements[el].firstChild.id}`
                ).style.border = "3px solid pink";
              }
            }

            // useHintOnce = false;
            // disabling the help icon as it can be only used once in a level by the player
            // helpBitbucket.style.pointerEvents = "none";
          });
        } else helpBitbucket.style.pointerEvents = "none";

        // third item is being pushed, to check for the correctness of the 3 pairs
        if (currentlyFlipped.length == 3) {
          let match = 0;

          for (key in questionsAns[currentDifficulty]) {
            for (let i = 0; i < currentlyFlipped.length; i++) {
              if (
                questionsAns[currentDifficulty][key].value.includes(
                  currentlyFlipped[i]
                )
              ) {
                match++;
              } else {
                match = 0;
                break;
              }
            }
            if (match == 3) {
              // increase the score by 10
              currentDifficulty == "easy"
                ? personalHomeStats.easyBitPair++
                : personalHomeStats.hardBitPair++;
              currentDifficulty == "easy" ? incScore("5") : incScore("10");
              populateModal(
                "Know why that was right?",
                [questionsAns[currentDifficulty][key].brief.reasoning]
                // questionsAns[currentDifficulty][key].brief.metadata
              );
              toggleClasses.forEach((el) => el.classList.toggle("hidden"));
              currentPairMadeCount++;
              currentPairMade.innerHTML = `Pairs made: ${currentPairMadeCount}`;
              break;
            }
          }
          if (match) {
            // updating the arrayForHints array to provide accurate hints to the player
            if (currentDifficulty == "easy") {
              let compareVar = "";
              let index = -1;
              for (let k = 0; k < currentlyFlipped.length; k++) {
                if (currentlyFlipped[k].includes("Image"))
                  compareVar = `${compareVar}-${
                    currentlyFlipped[k].split("I")[0]
                  }`;
                else compareVar = compareVar + "-" + currentlyFlipped[k];
              }

              let splitArray = compareVar.split("-");
              let result = true;
              for (let a = 0; a < arrayForHints.length; a++) {
                for (let y = 1; y < splitArray.length; y++) {
                  if (!arrayForHints[a].includes(splitArray[y])) {
                    result = false;
                    break;
                  } else result = true;
                }
                if (result) {
                  index = a;
                  break;
                }
              }
              if (result) {
                // deleting the required array element that has been correctly selected by the player
                arrayForHints = arrayForHints
                  .slice(0, index)
                  .concat(arrayForHints.slice(index + 1, arrayForHints.length));
              }
            }

            // selecting the correct divs and turning the color to green to indicate the correctness
            selectedTiles.forEach((divNo) => {
              let node = document.querySelector(`#card${divNo}`);
              node.style.border = "3px solid #13ed8f";
            });

            currentlyFlipped = [];
            selectedTiles = [];
          } else {
            personalHomeStats.wrongBitPair++;
            incScore("-2");
            lives.removeChild(lives.firstElementChild);
            // this will run when the last life is also exhausted
            if (!lives.childElementCount) {
              resetSelections();
              bitbucketGameDiv.style.display = "none";
              document.querySelector("#gameContainer").style.display = "none";
              bitbucketGameDiv.innerHTML = "";
              document.querySelector("#leftSideDiv").style.display = "none";
              document.querySelector("#rightSideDiv").style.display = "none";
              document.querySelector("#levelsCompletedDiv").innerHTML =
                gameCompleted === true
                  ? "Hooray 🥳, you have completed all of the levels for this week. <b>Congrats on that</b> & wait for the next week challenges<br><br><u>Click here to return to the village</u>"
                  : "Lives exhausted!! <u>Click here</u> to return to the village. Your lives will be restored back";
              document.querySelector(
                "#levelsCompletedDiv"
              ).style.backgroundColor = "red";
              document.querySelector("#levelsCompletedDiv").style.display =
                "block";
            } else resetSelections();
          }
        }
      }

      if (currentPairMadeCount == initSettings[currentDifficulty].maxValue) {
        bitGameSong.pause();
        claps.play();

        signupResult.flipLevel++;

        setTimeout(() => {
          if (muteUnmuteIcon.src.includes("volume_up.png")) bitGameSong.play();
        }, claps._duration * 1000);

        // check whether player has completed the last level or not?
        if (currentLevel == 3) gameCompleted = true;

        bitbucketGameDiv.innerHTML = "";
        resetImpVariables();
        initializeLevel({ level: signupResult.flipLevel });
      }
    });
  });
}

let totalLives = 3;

// very first function that will run initially
function initializeLevel({
  difficulty = "easy",
  level = 1,
  levelDataObj = {},
  levelDatArr = [],
  reloadProgress = false,
  allowHint = true,
}) {
  currentDifficulty = difficulty;
  currentLevel = level;
  levelData = levelDataObj;
  (levelDataArray = levelDatArr), (useHintOnce = allowHint);

  // not all of the levels are completed
  if (!gameCompleted) {
    let restoreLives = 0;
    document.querySelector("#gameContainer").style.display = "block";
    document.querySelector("#levelsCompletedDiv").style.display = "none";
    bitbucketGameDiv.style.display = "grid";

    restoreLives = lives.childElementCount;

    // restoring the lives back to 3 for each new level
    while (totalLives - restoreLives > 0) {
      let image = document.createElement("img");
      image.src = "./img/life.png";
      image.height = "45";
      image.width = "45";
      image.style.paddingLeft = "3px";
      lives.appendChild(image);
      restoreLives++;
    }

    if (reloadProgress) retrieveProgress = true;

    if (currentLevel == 4 || currentLevel == 5) {
      currentDifficulty = "hard";
      changeCSSVar(propertiesToBeChanged);
    }

    levelInfo.innerHTML = levelTitles[currentLevel - 1];
    for (let itr = 0; itr < initSettings[currentDifficulty].maxValue; itr++)
      populateLevelData();

    currentPairMadeCount = 0;
    currentPairMade.innerHTML = `Pairs made: ${currentPairMadeCount}`;
    currentDifficultyUI.innerHTML = currentDifficulty.toUpperCase();

    currentDifficulty === "easy"
      ? (currentDifficultyUI.style.color = "green")
      : (currentDifficultyUI.style.color = "red");

    populateLevelDataArray();

    //checking whether the user has traversed all the quetsions or not?
    if (levelDataArray.length < initSettings[currentDifficulty].tiles) {
      document.querySelector("#gameContainer").style.display = "none";
      document.querySelector("#leftSideDiv").style.display = "none";
      document.querySelector("#rightSideDiv").style.display = "none";
      document.querySelector("#levelsCompletedDiv").innerHTML =
        "Player, you have gone through all of the questions for the current difficulty level. Revisit the game again to check whether new questions have been added or not! <br><br>Click here to go back to the game";
      document.querySelector("#levelsCompletedDiv").style.display = "block";
    } else {
      updateUI();
      initializeUISelection();
    }
  }
  // completed all of the levels
  else {
    document.querySelector("#gameContainer").style.display = "none";
    document.querySelector("#leftSideDiv").style.display = "none";
    document.querySelector("#rightSideDiv").style.display = "none";
    document.querySelector("#levelsCompletedDiv").innerHTML =
      gameCompleted === true
        ? "You have completed all of the levels. <b>Congrats on that </b> <br><u>Click in this div to return to the village</u>"
        : "Lives exhausted";
    document.querySelector("#levelsCompletedDiv").style.display = "block";
  }
}

const exitBitGame = () => {
  movePlayer = true;
  bitGameSong.stop();
  bitbucketGameDiv.innerHTML = "";

  resetImpVariables();

  gameCanvas.style.display = "flex";
  atlassianBitbucketGame.style.display = "none";
  document.querySelector("#username").style.display = "block";
  document.querySelector(".musicOptions").style.display = "flex";
  document.querySelector("#weeklyRewards").style.display = "block";
  document.querySelector(".joystick-container").style.display = "flex";

  totalLives = lives.childElementCount;

  document.querySelector("body").style = "";
};

backToHome.addEventListener("click", () => {
  exitBitGame();

  currentActiveGame = "";
  jiraCanvas.style.display = "none";
  CANVAS.style.display = "inline-block";
  detailsDiv.style.display = "inline-block";
  atlassianJiraGame.style.display = "none";
});

document.querySelector("#levelsCompletedDiv").addEventListener("click", () => {
  movePlayer = true;
  bitGameSong.stop();
  controlMainSong(mainSong, "play");
  totalLives = 3;
  currentActiveGame = "";
  CANVAS.style.display = "block";
  gameCanvas.style.display = "flex";
  detailsDiv.style.display = "block";
  document.querySelector("body").style = "";
  atlassianBitbucketGame.style.display = "none";
  document.querySelector("#username").style.display = "block";

  document.querySelector(".joystick-container").style.display = "flex";
  document.querySelector("#leftSideDiv").style.display = "flex";
  document.querySelector("#rightSideDiv").style.display = "flex";
});

// to disable the "long press" event for mobiles
document.addEventListener(
  "contextmenu",
  function (e) {
    e.preventDefault();
  },
  false
);
