let innerHeight = 550;
let innerWidth = 900;

// boolean for player movement
let movePlayer = false;

let anotherChain = false;
let chainExplorer = "";

let score = 0;
let signupResult;

let walletName;
let changeAddress;

let transactions = "";
let purchasedSongs = "";
let mainSong = defaultSong;
let weeklyRewardsImage = "";

let modal = document.querySelector(".modal");
let overlay = document.querySelector(".overlay");
let paymentMemo = document.querySelector("#paymentMemo");
let closeModalBtn = document.querySelector(".btn-close");
let walletError = document.querySelector("#walletError");
let confirmation = document.querySelector("#confirmation");
let muteUnmuteIcon = document.querySelector("#muteUnmute");
let paymentAmount = document.querySelector("#paymentAmount");
let paymentDetails = document.querySelector("#paymentDetails");

function positionModal() {
  const height = document.querySelector(".modal").clientHeight;
  const width = document.querySelector(".modal").clientWidth;
}

// toggleZIndex function
function toggleZIndex(el = "") {
  const itr = [document.querySelector("#weeklyRewards")];
  for (let a = 0; a < itr.length; a++) {
    el != "" ? (itr[a].style.zIndex = "0") : (itr[a].style.zIndex = "5");
  }
  if (el != "") document.querySelector(`#${el}`).style.zIndex = "5";
}

let toggleClasses = [modal, overlay];
let songsMap = [defaultSong, drive, wallpaper, fluffingDuck];

let step1 = document.querySelector("#step1");
let step2 = document.querySelector("#step2");
let step4 = document.querySelector("#step4");
let timer = document.querySelector("#timer");
let paymentFlow = document.querySelector("#paymentFlow");

function incScore(localScore) {
  // score += localScore;
  document.querySelector("#overAllScore").innerHTML =
    parseInt(document.querySelector("#overAllScore").innerHTML) +
    parseInt(localScore);
}

// for queuing up the notifications
let notificationQueue = [];
let isNotificationShowing = false;
let notificationElement = document.getElementById("notification");

function showNotification(
  message,
  color = "rgba(0, 255, 0, 0.6)",
  duration = 2500
) {
  notificationQueue.push({ message, color, duration });
  processNotificationQueue();
}

function processNotificationQueue() {
  if (isNotificationShowing || notificationQueue.length === 0) {
    return;
  }

  const { message, color, duration } = notificationQueue.shift();
  isNotificationShowing = true;

  notificationElement.style.color =
    color === "rgba(255, 0, 0, 0.6)" ? "white" : "black";

  notificationElement.style.backgroundColor = color;
  notificationElement.innerHTML = message;

  // Key change: Remove 'hide' class *before* adding 'show'
  notificationElement.classList.remove("hide"); // Clear any previous hide
  notificationElement.classList.add("show"); // Then show

  setTimeout(() => {
    notificationElement = document.getElementById("notification");
    notificationElement.classList.remove("show"); // Hide after timeout

    setTimeout(() => {
      // Timeout for the hide transition
      notificationElement.classList.add("hide");
      isNotificationShowing = false;
      processNotificationQueue(); // Process the next one
    }, 300); // Duration of your hide transition (adjust as needed)
  }, duration);
}

// music functionality
function controlMainSong(song, control) {
  mainSong.stop();
  if (song["_src"].includes("defaultSong")) {
    if (control == "play") {
      mainSong = defaultSong;
      defaultSong.play();
    } else defaultSong.stop();
  } else if (song["_src"].includes("darkPassenger")) {
    if (control == "play") {
      mainSong = darkPassenger;
      darkPassenger.play();
    } else darkPassenger.stop();
  } else if (song["_src"].includes("drive")) {
    if (control == "play") {
      mainSong = drive;
      drive.play();
    } else drive.stop();
  } else if (song["_src"].includes("fluffingDuck")) {
    if (control == "play") {
      mainSong = fluffingDuck;
      fluffingDuck.play();
    } else fluffingDuck.stop();
  } else if (song["_src"].includes("powerfulTrap")) {
    if (control == "play") {
      mainSong = powerfulTrap;
      powerfulTrap.play();
    } else powerfulTrap.stop();
  } else if (song["_src"].includes("wallpaper")) {
    if (control == "play") {
      mainSong = wallpaper;
      wallpaper.play();
    } else wallpaper.stop();
  }
}

const attachMusicEventListeners = () => {
  document.querySelector(".musicOptions").style.display = "flex";
  const musicCount = document.querySelectorAll(`.musicOptions p`).length;

  for (let a = 1; a <= musicCount; a++) {
    const musicOption = document.querySelector(
      `.musicOptions span :nth-child(${a})`
    );

    musicOption.style.color = "black";
    musicOption.style.padding = "4px";
    musicOption.style.borderRadius = "4px";

    musicOption.addEventListener("mouseenter", (el) => {
      if (muteUnmuteIcon.src.includes("volume_mute.png")) return;

      document.querySelectorAll(`.musicOptions p`).forEach((music) => {
        music.style.background = "white";
      });

      el.target.style.background = "rgba(76, 215, 26, 0.7)";

      controlMainSong(mainSong, "stop");

      let song = el.target.getAttribute("id");
      if (song == "defaultSong") controlMainSong(defaultSong, "play");
      // else if (song == "darkPassenger") controlMainSong(darkPassenger, "play");
      else if (song == "drive") controlMainSong(drive, "play");
      else if (song == "fluffingDuck") controlMainSong(fluffingDuck, "play");
      // else if (song == "powerfulTrap") controlMainSong(powerfulTrap, "play");
      else if (song == "wallpaper") controlMainSong(wallpaper, "play");
    });
  }
};

// modal script
const populateModal = (heading, paragraph, link = "") => {
  document.querySelector(".modal div").innerHTML = "";
  document.querySelector(".modal h2").textContent = "";
  document.querySelector(".modal h2").textContent = `${heading}`;
  // document.querySelector(".modal div").innerHTML = `<p style="text-align: center; padding: 4px; border-radius: 4px">${paragraph}</p>`

  for (let i = 0; i < paragraph.length; i++) {
    document.querySelector("#graniteGuidance").style.display = "none";

    let p = document.createElement("p");
    p.style.textAlign = "justify";
    p.style.padding = "4px";
    p.style.borderRadius = "4px";

    p.innerHTML = paragraph[i];

    if (heading == "Know why that was right?")
      p.style.background = "rgba(0,255,0,0.5)";

    document.querySelector(".modal div").appendChild(p);
  }

  if (heading == "GAME SUMMARY") {
    document.querySelector(".btn-close").style.display = "none";
  }

  if (heading == "Know why that was right?" && link != "") {
    let div = document.createElement("div");
    div.style.textAlign = "center";
    div.style.margin = "7px";
    div.innerHTML = "👉🏼" + link;
    document.querySelector(".modal div").appendChild(div);
    // positionModal()
  }

  if (heading == "Career Guidance") {
    document.querySelector("#graniteGuidance").style.display = "block";
    document.querySelector("#getAIGuidance").style.display = "inline";

    document
      .querySelector("#getAIGuidance")
      .addEventListener("click", async (el) => {
        el.target.style.display = "none";

        document.body.style.pointerEvents = "none";
        document.querySelector("#loader").style.display = "block";
        showNotification("Running IBM Granite model to grab career insights");

        const aiCareer = await callIBMGranitModel(
          JSON.stringify({
            params: `Right triplets: ${personalHomeStats.easyBitPair} Wrong triplets: ${personalHomeStats.wrongBitPair} Mazes completed: ${currentJiraLevel} Times ran out: ${personalHomeStats.runOutOfTime} Video levels completed: ${videoLevelsPlayed} Suggested Subjects: ${subjectsArray[0]}, ${subjectsArray[1]}, ${subjectsArray[2]}`,
          }),
          "getCareerGuidance"
        );

        if (aiCareer.result || aiCareer.error == null) {
          document.querySelector("#graniteGuidance table").style.display =
            "block";

          document.querySelector("#creativity").textContent =
            aiCareer.result.creativity;
          document.querySelector("#originality").textContent =
            aiCareer.result.originality;
          document.querySelector("#innovation").textContent =
            aiCareer.result.innovation;

          let pathUL = document.createElement("ul");
          aiCareer.result.career_paths.forEach((path) => {
            let pathLIs = document.createElement("li");
            pathLIs.textContent = path;
            pathUL.appendChild(pathLIs);
          });

          let imporovementUL = document.createElement("ul");
          aiCareer.result.improvements.forEach((imp) => {
            let improvementLIs = document.createElement("li");
            improvementLIs.textContent = imp;
            imporovementUL.appendChild(improvementLIs);
          });

          document.querySelector("#careerPath").appendChild(pathUL);
          document.querySelector("#improvements").appendChild(imporovementUL);
        }

        document.querySelector("#loader").style.display = "none";
        document.body.style.pointerEvents = "auto";
      });
  }
};

function resetStyling() {
  toggleZIndex();
  timer.style.display = "none";
  paymentFlow.style.display = "none";
  confirmation.style.display = "none";
  paymentDetails.style.display = "none";
  closeModalBtn.style.display = "block";
  document.querySelector("#weeklySection").style.display = "none";

  step1.style.filter = "grayscale(100%)";
  step2.style.filter = "grayscale(100%)";
  step4.style.filter = "grayscale(100%)";
  document.querySelector(".modal div").style.display = "block";
}

const closeModal = function () {
  movePlayer = true;
  resetStyling();
  toggleClasses.forEach((el) => el.classList.toggle("hidden"));
  document.querySelector("#weeklyRewards").style.pointerEvents = "auto";
};

closeModalBtn.addEventListener("click", closeModal);

// for handling the landing section stuff
const reasons = [
  "3-in-1 game that will make you fall in love with learing",
  "Let IBM Granite aid you in finding the best career path",
  "Fun challenges that keep you coming back for more",
  "Brain-teasing quests to test your skills",
  "Learn while playing",
];

const fullForms = [
  "Goal Glider",
  "IBM-Powered Gaming",
  "Playful arena",
  "Engaging Challenges",
  "Competitive Fun",
];

const fullFormDiv = document.querySelector("#full-form");
const reasoningDiv = document.querySelector("#reasoning");

function startAnimation() {
  document.querySelectorAll("#letters img").forEach((letter, ind) => {
    setTimeout(() => {
      // Hide the text first (fade-out)
      fullFormDiv.style.opacity = 0;
      reasoningDiv.style.opacity = 0;

      setTimeout(() => {
        // Update the content
        reasoningDiv.textContent = reasons[ind];
        fullFormDiv.textContent = fullForms[ind];

        // Fade the text back in (fade-in)
        fullFormDiv.style.opacity = 1;
        reasoningDiv.style.opacity = 1;

        letter.style.filter = "grayscale(0)";
      }, 500); // Short delay to allow fade-out before updating text

      // Reset after all letters are traversed
      if (ind === document.querySelectorAll("#letters img").length - 1) {
        setTimeout(() => {
          document.querySelectorAll("#letters img").forEach((letter) => {
            letter.style.filter = "grayscale(100%)";
          });
          startAnimation(); // Restart animation
        }, 4000); // 4-second break before restarting
      }
    }, ind * 3000); // Delay between each letter's appearance
  });
}

// Start the animation cycle
startAnimation();

const gsapAnimations = [
  // 0. Smile animation
  {
    duration: 2, // Duration for the full motion
    x: (i) => i * 30 - 60, // Moves letters horizontally
    y: (i) => Math.sin(i * 0.7) * 50 - 20, // Bends letters to form a smile (curve)
    rotate: (i) => i * 10 - 20, // Slight rotation for a curved look
    ease: "power1.inOut", // Smooth easing effect
    repeat: -1, // Repeat infinitely
    yoyo: true, // Reverse the animation to create a loop
    stagger: 0.2, // Stagger the animation so each letter moves with a small delay
  },
  // 1. Vertical movement and rotation
  {
    duration: 1.5, // Duration of the animation for each letter
    y: (i) => (i % 2 === 0 ? -20 : 20), // Alternating vertical movement (up for even letters, down for odd)
    rotate: (i) => (i % 2 === 0 ? 10 : -10), // Alternating rotation (clockwise for even, counterclockwise for odd)
    ease: "power2.inOut", // Smooth easing for the motion
    stagger: 0.2, // Stagger between letters
    repeat: -1, // Repeat infinitely
    yoyo: true, // Reverse the animation to make it continuous
  },
  // 2. Zoom In and Rotate
  {
    duration: 1.5,
    scale: 1.3, // Scale up the letters
    rotate: 360, // Rotate a full circle
    ease: "power1.inOut", // Smooth transition for scaling and rotation
    stagger: 0.2, // Delay between each letter
    repeat: -1,
    yoyo: true, // Reverse back to original size and rotation
  },
  // 3. Wave and Float Effect
  {
    duration: 2,
    y: (i) => Math.sin(i * 1.5) * 30, // Create wave effect with vertical motion
    rotate: (i) => i * 15 - 30, // Rotate letters slightly
    ease: "sine.inOut", // Smooth wave motion
    stagger: 0.25, // Delay for wave effect
    repeat: -1,
    yoyo: true, // Reverse motion for continuous wave
  },
  // 4. Flip and Slide Up
  {
    duration: 1.2,
    y: -50, // Slide letters upwards
    rotateX: 180, // Flip letters vertically
    ease: "power2.out", // Smooth easing for the flip
    stagger: 0.3, // Delay between letters
    repeat: -1,
    yoyo: true, // Reverse the flip and slide for continuous effect
  },
  // 5. Horizontal Slide and Bounce Effect
  {},
];

const animationInd = Math.floor(Math.random() * gsapAnimations.length);

if (animationInd == 5) {
  gsap.fromTo(
    "#letters img",
    {
      x: (i) => (i % 2 === 0 ? -100 : 100), // Slide from left for even letters, right for odd
    },
    {
      duration: 1.5,
      x: 0, // Move to the center (normal position)
      ease: "bounce.out", // Add bounce effect
      stagger: 0.3, // Delay between each letter
      repeat: -1,
      yoyo: true,
    }
  );
} else {
  gsap.to("#letters img", gsapAnimations[animationInd]);
}

// populate tutorial
let imageDiv = document.querySelector("#imageDiv");
let heading = document.querySelector("#heading");
let image = document.querySelector("#image");
let para = document.querySelector("#para");

let currentTutorial = 0;

const headings = [
  "1. Why this game?",
  "2. Flip the tiles game basics",
  "3. Maze runner game basics",
  "4. Q&A playground game basics",
  "5. Personal room (stats)",
];

const images = [
  "./img/i1.png",
  "./img/i2.png",
  "./img/i3.png",
  "./img/i4.png",
  "./img/i5.png",
];

const paras = [
  "This is a bare-javascript game that has the capabilities to beat any proficient game out in the market. Games are undoubtedly the logical sharpeners for our brains. With a combo of 3 functional games and lots of add-ons, the user won't be bored at any point of time and will cater knowledge throughout the process",
  "'Flip the tiles' is a tile-matching game that has either 9 tiles. A correct answer will comprise three co-related tiles pertaining to 3 of the 6 topics: Data Science, Environment, Data Structures & Algo (DSA), Maths, History, and Robotics. Hints will also be there.",
  "In 'Maze runner', time will be chasing the player. Make it to the exit and beat a level, it is all about adventure and cognitive skills. A total of 6 levels are there to test you against some of the hard mazes. Time will vary from one level to another. Once lost, you have to start from the recent cleared level. Help the player to reach his house which is at the end of the levels",
  "'Q&A Playground' is having 9 paras related to varying domains (Technology, History & Environment) to make sure that at the expense of playing the game, the user learns a lot and also enjoys. Read the para & answer the MCQs.",
  "'Perosonal room' is beneficial to see the stats gathered throughout the gaming tenure, so visit this room at the end as there is no way out of this room. Visit it, see the stats and close the game. To get out of any game room, use BACKSPACE.",
];

const leftOperation = (ind) => {
  if (ind > 0) populateTutorial(ind - 1);
};

const rightOperation = (ind) => {
  if (ind < images.length) populateTutorial(ind + 1);
};

document.querySelector("#leftKey").addEventListener("click", () => {
  leftOperation(currentTutorial);
});

document.querySelector("#rightKey").addEventListener("click", () => {
  rightOperation(currentTutorial);
});

const populateTutorial = (ind = 0) => {
  currentTutorial = ind;

  image.style.borderRadius = "10px";

  swap(imageDiv, para);
  getCoordinates();

  let leftKey = document.querySelector("#leftKey");
  let rightKey = document.querySelector("#rightKey");

  leftKey.style.visibility = "visible";
  rightKey.style.visibility = "visible";

  if (ind == 0) leftKey.style.visibility = "hidden";
  if (ind == headings.length - 1) rightKey.style.visibility = "hidden";

  heading.textContent = headings[ind];
  heading.style.padding = "0.5rem";
  image.src = images[ind];
  image.style.width = "450px";
  image.style.height = "200px";
  para.textContent = paras[ind];
};

const swap = (nodeA, nodeB) => {
  const parentA = nodeA.parentNode;
  const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

  nodeB.parentNode.insertBefore(nodeA, nodeB);
  parentA.insertBefore(nodeB, siblingA);
};

document.querySelector("#tutorialImage").addEventListener("click", () => {
  if (document.querySelector("#tutorial").style.display == "none") {
    document.querySelector("#landing-section").style.display = "none";
    document.querySelector("#tutorial").style.display = "flex";

    populateTutorial();
  } else {
    document.querySelector("#landing-section").style.display = "flex";
    document.querySelector("#tutorial").style.display = "none";
  }
});

function getCoordinates() {
  para.style.startX = imageDiv.getBoundingClientRect().x;
  imageDiv.style.startX = imageDiv.getBoundingClientRect().x;
}
