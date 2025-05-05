const videoPoints = 0;
const qna = document.querySelector("#qna");
const video = document.querySelector("#video");
const startDiv = document.querySelector("#startDiv");
const videoPlayer = document.querySelector("#videoPlayer");
const instructions = document.querySelector("#instructions");
const videoQuestions = document.querySelector("#videoQuestions");
const proceedBtn = document.querySelector("#videoProceed button");

const wrong = document.querySelector("#wrong");
const correct = document.querySelector("#correct");

const qnaTimer = document.querySelector("#qnaTimer");
let videoTimer = document.querySelector("#videoTimer");

let videoLevels = document.querySelector("#videoLevels");

let qnaInterval;
let videoInterval;

let wrongAns = false;

// for tracking the session parameters
let videoLevelsPlayed = 0;

// 2 paras for each of the 3 subjects
let QUESTIONSLENGTHCONSTANT = 6;

let videoParas = [
  // environment
  "The Earth's atmosphere is divided into multiple layers, each serving a unique purpose. The troposphere, the lowest layer, extends only a few miles above the Earth's surface and is where all weather events occur. Above it, the stratosphere contains the ozone layer, which absorbs harmful ultraviolet radiation.<br><br>Airplanes prefer flying in the stratosphere as it offers a stable environment with minimal turbulence. Further up, the thermosphere is where charged particles exist, forming the ionosphere, which helps in radio wave transmission. Beyond that, the exosphere fades into space, containing very few molecules",
  "The world’s largest mammals, whales, travel great distances for migration. Many species breed in warm tropical waters, where conditions are ideal for their young. Among them, the humpback whale is known for its distinct songs and acrobatics. However, the 20th century saw excessive commercial whaling, leading to a dramatic decline in whale populations.<br><br>In 1986, an international ban on commercial whaling was enforced to protect these magnificent creatures. Some of the most breathtaking footage of these animals comes from places like South Africa, where marine life thrives in nutrient-rich waters.",

  // robotics
  "Artificial intelligence is powered by neural networks, which mimic the human brain. Instead of using simple classifications, these models rely on feature detection to recognize patterns in data. A critical component behind modern AI is GPUs (Graphics Processing Units), which allow fast computations.<br><br>In the case of facial recognition, AI maps multiple facial features to identify individuals. The foundation of AI technology relies on vast amounts of big data, collected from various sources to train these intelligent systems.",
  "Computers and mobile devices rely on operating systems (OS) to function. Some well-known OSs include Windows, macOS, Linux, and Android, but not every system qualifies as a true OS. Apple provides two different platforms: macOS for computers and iOS for mobile devices. Meanwhile, Google dominates the mobile OS market with Android, powering millions of smartphones and tablets.<br><br>The fundamental role of an OS is to act as an intermediary between the user and the computer, managing hardware and software resources efficiently.",

  // data science
  "In the digital world, encryption plays a crucial role in securing information. It works by scrambling plain text so that only authorized parties can read it. One of the most widely used mathematical operations for encryption is the modulus function, which ensures data security.<br><br>In cryptographic communication, a public key is used for encryption, while a private key is needed to decrypt messages. A key security technique in this field involves hashing and salting, which protects passwords and sensitive data from attacks.",
  "Data science is a multidisciplinary field that uses scientific methods, processes, algorithms, and systems to extract knowledge and insights from structured and unstructured data. It involves techniques and theories drawn from many fields within the context of mathematics, statistics, computer science, and information science.<br><br>Machine learning, a subset of data science, focuses on the development of computer programs that can access data and use it to learn for themselves. This learning process can be supervised, unsupervised, or semi-supervised, depending on the amount of information provided to the algorithm",

  // history
  "The Industrial Revolution reshaped the modern world, bringing technological advancements that changed industries forever. The term itself was coined by historian Arnold Toynbee to describe this transformative period. Among the most critical inventions of this era was the steam engine, which powered factories, ships, and trains.<br><br>However, the revolution wouldn’t have been possible without the Agricultural Revolution, which ensured food supply for a growing workforce. It all began in the United Kingdom, later spreading to Europe and beyond.",
  "World War II was a global conflict fought between the Allied Powers and the Axis Powers. The United States, alongside its allies, fought against nations like Germany, Italy, and Japan. The war saw some of the darkest events in human history, including the dropping of the atomic bomb on August 6, 1945, which marked the beginning of the end. <br><br>While Japan, Germany, and Italy formed the core of the Axis, the USSR (Soviet Union) was not part of this group. The war lasted from 1939 to 1945, shaping the modern world order.",

  // dsa
  "A linked list is a linear data structure where elements, called nodes, are stored non-contiguously in memory. Each node contains data and a pointer to the next node, allowing dynamic memory allocation and efficient insertions or deletions. Unlike arrays, linked lists don’t require resizing. Variants like singly, doubly, and circular linked lists offer flexibility for different use cases, such as navigation in browsers or memory-efficient queues.",
  "A graph is a non-linear data structure made of nodes (called vertices) connected by edges. It can be directed or undirected, depending on whether the connections have a direction. Graphs are used to model networks like social media, maps, or the internet. A common way to represent a graph is with an adjacency list, which is memory-efficient compared to an adjacency matrix.<br><br>Traversal algorithms like BFS (Breadth-First Search) explore level by level, while DFS (Depth-First Search) dives deep along a path before backtracking.",

  // maths
  "Mathematics, often abbreviated as 'math', is the study of topics such as quantity, structure, space, and change. It encompasses a wide range of disciplines, including algebra, geometry, and calculus. Algebra is a branch of mathematics dealing with symbols and the rules for manipulating those symbols. It is fundamental to many areas of mathematics, including geometry and calculus, and has numerous applications in the real world.<br><br>Geometry, on the other hand, is the study of shapes, sizes, positions, and dimensions of objects. It has been a subject of study for thousands of years, with its roots tracing back to ancient civilizations.",
  "Mathematics is a powerful language used to describe and understand the world around us. It goes far beyond basic arithmetic, diving into advanced areas like number theory, which studies the unique properties and patterns of integers. Calculus helps us understand change and motion—one key result is that the derivative of  e^x is still 𝑒^𝑥.<br><br>Combinatorics focuses on counting and arrangements; for example, there are exactly 24 different ways to arrange the letters in the word “MATH.” In linear algebra, matrices are studied to understand systems and transformations, and their eigenvalues reveal deep structural insights. Mastering these concepts help develop precision in thinking and problem-solving across all scientific fields.",
];

// tracks: environment, technology, history (3 of each)
let videoTracker = {
  // environment
  0: {
    type: "environment",
    used: false,
    videoQuestions: {
      0: {
        q: "Which layer carries electrical charges?",
        o: ["Atmosphere", "Thermosphere", "Stratosphere", "Exosphere"],
        ans: "Thermosphere",
      },
      1: {
        q: "What is the range of Troposphere?",
        o: ["50-75 miles", "30-35 miles", "4-10 miles", "above 400 miles"],
        ans: "4-10 miles",
      },
      2: {
        q: "Why aeroplanes fly in the Stratosphere?",
        o: [
          "No weather disturbances",
          "Ions presence",
          "Low temperature",
          "High lift",
        ],
        ans: "No weather disturbances",
      },
      3: {
        q: "Layer which blocks out UV rays",
        o: ["Thermosphere", "Stratosphere", "Troposphere", "Exosphere"],
        ans: "Stratosphere",
      },
    },
  },
  1: {
    type: "environment",
    used: false,
    videoQuestions: {
      0: {
        q: "Where do they breed?",
        o: ["Arctic", "Swamps", "Marshs", "Tropics"],
        ans: "Tropics",
      },
      1: {
        q: "Which species of whales were referred in the para?",
        o: ["Humpback", "Orca", "Blue", "Fin"],
        ans: "Humpback",
      },
      2: {
        q: "In which year, commercial whaling was banned?",
        o: ["1903", "1804", "1972", "1986"],
        ans: "1986",
      },
      3: {
        q: "Which location was picturized in the question?",
        o: ["South Africa", "Asia", "Antartica", "Australia"],
        ans: "South Africa",
      },
    },
  },
  // robotics
  2: {
    type: "robotics",
    used: false,
    videoQuestions: {
      0: {
        q: "Neural network works upon?",
        o: ["Classes", "Feature Detection", "Labels", "Error Detection"],
        ans: "Feature Detection",
      },
      1: {
        q: "AI softwares are possible due to?",
        o: ["Cathode Rays", "CPUs", "Transistors", "GPUs"],
        ans: "GPUs",
      },
      2: {
        q: "A human face can have how many facial features?",
        o: ["14", "10", "15", "17"],
        ans: "15",
      },
      3: {
        q: "What can be regarded as the university for AI softwares?",
        o: ["Artificial neurons", "Dark web", "Segmented data", "Big data"],
        ans: "Big data",
      },
    },
  },
  3: {
    type: "robotics",
    used: false,
    videoQuestions: {
      0: {
        q: "Which is not an OS?",
        o: ["macOS", "iOS", "LibOS", "Windows"],
        ans: "LibOS",
      },
      1: {
        q: "Google offers OS for what kind of devices?",
        o: ["Kiosk", "Mac", "Tablets", "Android"],
        ans: "Android",
      },
      2: {
        q: "OS is an intermediary between",
        o: [
          "User & computer",
          "Monitor & computer",
          "User & monitor",
          "CPU & printer",
        ],
        ans: "User & computer",
      },
      3: {
        q: "Which is an OS offered by Apple?",
        o: ["MacOS", "Windows", "Linux", "Unix"],
        ans: "MacOS",
      },
    },
  },
  // data science
  4: {
    type: "dataScience",
    used: false,
    videoQuestions: {
      0: {
        q: "What is used in real life for encryption?",
        o: ["Addition", "Division", "Modulus", "Multiplication"],
        ans: "Modulus",
      },
      1: {
        q: "What is encryption?",
        o: [
          "Conversion to numerical value",
          "Scrambling a plain text",
          "Debugging",
          "Project testing",
        ],
        ans: "Scrambling a plain text",
      },
      2: {
        q: "Key used by both parties to encrypt message",
        o: ["Public", "Private", "Foreign", "Candidate"],
        ans: "Public",
      },
      3: {
        q: "Terms related to cryptography",
        o: [
          "Machine Learning",
          "Web",
          "Hash & salt",
          "Artificial Intelligence",
        ],
        ans: "Hash & salt",
      },
    },
  },
  5: {
    type: "dataScience",
    used: false,
    videoQuestions: {
      0: {
        q: "Which of the following is not a field that contributes to data science?",
        o: ["Mathematics", "Computer science", "Biology", "Physics"],
        ans: "Biology",
      },
      1: {
        q: "Which field does machine learning belong to?",
        o: [
          "Artificial intelligence",
          "Data science",
          "Computer science",
          "Mathematics",
        ],
        ans: "Data science",
      },
      2: {
        q: "What is the difference between data science and machine learning?",
        o: [
          "Data science is a subset of machine learning",
          "Machine learning is a subset of data science",
          "Both are the same",
          "None of the above",
        ],
        ans: "Machine learning is a subset of data science",
      },
      3: {
        q: "What is the role of statistics in data science?",
        o: [
          "Extracting insights from data",
          "Developing algorithms",
          "Defining the problem",
          "All of the above",
        ],
        ans: "All of the above",
      },
    },
  },
  // history
  6: {
    type: "history",
    used: false,
    videoQuestions: {
      0: {
        q: "Who coined the termed Industrial Revolution?",
        o: ["James Watt", "Arnold Toynbee", "Robert Owen", "George Stephenson"],
        ans: "Arnold Toynbee",
      },
      1: {
        q: "What was the integral part of this revolution?",
        o: ["Cotton", "Iron & coal", "Steam engine", "Power loom"],
        ans: "Steam engine",
      },
      2: {
        q: "What helped Industrial revolution to flourish?",
        o: [
          "Blue Revolution",
          "White Revolution",
          "Green Revolution",
          "Agricultural Revolution",
        ],
        ans: "Agricultural Revolution",
      },
      3: {
        q: "From where this revolution started?",
        o: ["UK", "Europe", "USA", "Asia"],
        ans: "UK",
      },
    },
  },
  7: {
    type: "history",
    used: false,
    videoQuestions: {
      0: {
        q: "Who was fighting against Axis powers?",
        o: ["Japan", "Poland", "USA", "Italy"],
        ans: "USA",
      },
      1: {
        q: "When was atomic bomb dropped?",
        o: ["6 Sept 1955", "6 Aug 1945", "16 Jan 1947", "31 Jan 1943"],
        ans: "6 Aug 1945",
      },
      2: {
        q: "Which one is not a part of Axis powers?",
        o: ["Japan", "USSR", "Germany", "Italy"],
        ans: "USSR",
      },
      3: {
        q: "What was the timeline of the war?",
        o: ["1930-40", "1939-46", "1938-47", "1939-45"],
        ans: "1939-45",
      },
    },
  },
  // dsa
  8: {
    type: "dsa",
    used: false,
    videoQuestions: {
      0: {
        q: "What does each node in a singly linked list contain?",
        o: [
          "Only data",
          "Data and a pointer to the previous node",
          "Data and a pointer to the next node",
          "Only a pointer",
        ],
        ans: "Data and a pointer to the next node",
      },
      1: {
        q: "What advantage does a linked list have over an array?",
        o: [
          "Faster element access",
          "Fixed size",
          "Efficient insertions/deletions",
          "Better sorting algorithms",
        ],
        ans: "Efficient insertions/deletions",
      },
      2: {
        q: "Which type of linked list allows traversal in both directions?",
        o: [
          "Singly linked list",
          "Circular linked list",
          "Doubly linked list",
          "Null-linked list",
        ],
        ans: "Doubly linked list",
      },
      3: {
        q: "What does the last node of a circular linked list point to?",
        o: ["NULL", "Head node", "Previous node", "Random node"],
        ans: "Head node",
      },
    },
  },
  9: {
    type: "dsa",
    used: false,
    videoQuestions: {
      0: {
        q: "What are the elements in a graph called?",
        o: [
          "Nodes and stacks",
          "Trees and leaves",
          "Vertices and edges",
          "Points and lines",
        ],
        ans: "Vertices and edges",
      },
      1: {
        q: "What distinguishes a directed graph from an undirected one?",
        o: [
          "Weighted edges",
          "Directional edges",
          "Numbered vertices",
          "Loops",
        ],
        ans: "Loops",
      },
      2: {
        q: "Which representation of a graph is more space-efficient for sparse graphs?",
        o: [
          "Adjacency matrix",
          "Adjacency list",
          "Edge matrix",
          "Connection tree",
        ],
        ans: "Adjacency list",
      },
      3: {
        q: "Which algorithm explores nodes level by level?",
        o: ["DFS", "Merge sort", "BFS", "Dijkstra algo"],
        ans: "BFS",
      },
    },
  },
  // math
  10: {
    type: "math",
    used: false,
    videoQuestions: {
      0: {
        q: "What does algebra deal with?",
        o: [
          "Geometry",
          "Shapes",
          "Symbols and rules for manipulating those symbols",
          "Calculus",
        ],
        ans: "Symbols and rules for manipulating those symbols",
      },
      1: {
        q: "Which ancient civilizations contributed to the study of geometry?",
        o: ["Greeks", "Romans", "Egyptians", "All of the above"],
        ans: "All of the above",
      },
      2: {
        q: "What is geometry about?",
        o: ["Shapes", "Sizes", "Dimensions of objects", "All of the above"],
        ans: "All of the above",
      },
      3: {
        q: "Which branch of mathematics deals with rates of change and slopes?",
        o: ["Algebra", "Geometry", "Calculus", "All of the above"],
        ans: "Calculus",
      },
    },
  },
  11: {
    type: "math",
    used: false,
    videoQuestions: {
      0: {
        q: "Which area of mathematics studies the behavior of integers?",
        o: ["Geometry", "Calculus", "Number Theory", "Statistics"],
        ans: "Number Theory",
      },
      1: {
        q: "What is the derivative of the exponential function e^x?",
        o: ["1", "x", "e^x", "0"],
        ans: "e^x",
      },
      2: {
        q: "How many unique ways can the letters in “MATH” be arranged?",
        o: ["12", "24", "36", "48"],
        ans: "24",
      },
      3: {
        q: "What matrix concept helps reveal structural properties?",
        o: ["Limit", "Tangent", "Gradient", "Eigen value"],
        ans: "Eigen value",
      },
    },
  },
};

let randomNum;

const qnaCountdown = async () => {
  qnaTimer.textContent--;
  if (qnaTimer.textContent < 10 && qnaTimer.textContent.split("").length == 1)
    qnaTimer.textContent = `0${qnaTimer.textContent}`;
  if (qnaTimer.textContent == 0) {
    clearInterval(qnaInterval);
    video.style.display = "none";
    videoQuestions.style.display = "none";

    startDiv.style.display = "flex";
    instructions.style.display = "none";

    // if the user has provided the correct answers
    if (
      document.querySelector("#q1Ans").value !== "select" &&
      document.querySelector("#q2Ans").value !== "select" &&
      document.querySelector("#q3Ans").value !== "select" &&
      document.querySelector("#q4Ans").value !== "select" &&
      document.querySelector("#q1Ans").value ===
        videoTracker[randomNum].videoQuestions[0].ans &&
      document.querySelector("#q2Ans").value ===
        videoTracker[randomNum].videoQuestions[1].ans &&
      document.querySelector("#q3Ans").value ===
        videoTracker[randomNum].videoQuestions[2].ans &&
      document.querySelector("#q4Ans").value ===
        videoTracker[randomNum].videoQuestions[3].ans
    ) {
      videoLevelsPlayed++;
      incScore("5");
      document.querySelector("#score").textContent =
        document.querySelector("#overAllScore").textContent;
      if (Number(videoLevels.textContent) < QUESTIONSLENGTHCONSTANT)
        videoLevels.textContent = Number(videoLevels.textContent) + 1;

      proceedBtn.disabled = true;
      claps.play();
      proceedBtn.disabled = false;
      wrongAns = false;
      correct.style.display = "block";
      wrong.style.display = "none";
      videoTracker[randomNum].used = true;
      proceedBtn.textContent = "Next question";

      // update the levels in the database
      signupResult.videoLevel++;
    } else {
      incScore("-2");
      document.querySelector("#score").textContent =
        document.querySelector("#overAllScore").textContent;

      document.querySelector("#score").textContent =
        document.querySelector("#overAllScore").textContent;
      wrongAns = true;
      wrong.style.display = "block";
      correct.style.display = "none";
      videoTracker[randomNum].used = false;
      proceedBtn.textContent = "Retry";
    }

    // resetting the UI assets
    qna.style.display = "none";
    qnaTimer.style.display = "none";
    videoTimer.style.display = "block";

    // emptying the question fields
    for (let a = 1; a < 5; a++) {
      document.querySelector(`#q${a}`).remove();
      document.querySelector(`#q${a}Ans`).remove();
    }

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

    video.style.background = "rgba(0,0,0,0)";
    videoQuestions.style.background = "white";

    currentActiveGame = "thetaVideo";
  }
};

const switchQuestionsAns = () => {
  // videoPlayer.innerHTML = "";
  videoPlayer.style.display = "none";
  qna.style.display = "block";
  qnaTimer.style.display = "block";
  videoTimer.style.display = "none";

  videoQuestions.style.background = "rgba(0,0,0,0)";
  video.style.background = "white";
  video.style.alignItems = "center";

  for (let a = 0; a < 4; a++) {
    const para = document.createElement("p");
    para.style.margin = "0 0 4px 0";
    para.setAttribute("id", `q${a + 1}`);
    para.textContent = `${a + 1}. ${
      videoTracker[randomNum].videoQuestions[a].q
    }`;
    qna.appendChild(para);

    const select = document.createElement("select");
    select.style.margin = "0 0 8px 0";
    select.style.padding = "0.1rem";
    select.style.borderRadius = "4px";
    select.setAttribute("id", `q${a + 1}Ans`);

    let option = document.createElement("option");
    option.setAttribute("value", "select");
    option.textContent = "Select";
    select.appendChild(option);

    for (let op = 0; op < 4; op++) {
      let option = document.createElement("option");
      option.setAttribute(
        "value",
        videoTracker[randomNum].videoQuestions[a].o[op]
      );
      option.textContent = videoTracker[randomNum].videoQuestions[a].o[op];
      select.appendChild(option);
    }
    qna.appendChild(select);
  }
  currentActiveGame = "thetaVideo";
  qnaTimer.textContent = 20;
  qnaInterval = window.setInterval(qnaCountdown, 1000);
};

const videoCountdown = () => {
  videoTimer.textContent--;
  if (
    videoTimer.textContent < 10 &&
    videoTimer.textContent.split("").length == 1
  )
    videoTimer.textContent = `0${videoTimer.textContent}`;
  if (videoTimer.textContent == 0) {
    clearInterval(videoInterval);
    // videoPlayer.innerHTML = "";
    videoPlayer.style.display = "none";
    switchQuestionsAns();
  }
};

const populateUI = () => {
  startDiv.style.display = "none";
  videoQuestions.style.display = "flex";
  video.style.display = "flex";

  videoTimer.textContent = 45;
  videoInterval = window.setInterval(videoCountdown, 1000);

  const tags = [
    "robotics",
    "environment",
    "history",
    "math",
    "dsa",
    "dataScience",
  ];
  tags.forEach((el) => {
    if (videoTracker[randomNum].type === el) {
      document.querySelector(`#${el}`).style.display = "block";
    }
  });
};

document.querySelector("#videoProceed").addEventListener("click", (e) => {
  document.querySelector("#completedAllLevels").style.display = "none";

  // generates a no between 0 and 8
  randomNum = Math.floor(Math.random() * QUESTIONSLENGTHCONSTANT);

  // Previous way to track the number of questions done
  // let itr = 0;
  // for (let el in videoTracker) {
  //   if (videoTracker[el].used) itr++;
  // }
  // if (itr < QUESTIONSLENGTHCONSTANT)

  if (signupResult.videoLevel < QUESTIONSLENGTHCONSTANT) {
    if (
      !wrongAns &&
      (proceedBtn.textContent == "Proceed" ||
        proceedBtn.textContent == "Retry" ||
        proceedBtn.textContent == "Next question")
    ) {
      // Perform your logic here
    }

    while (videoTracker[randomNum].used) {
      randomNum = Math.floor(Math.random() * QUESTIONSLENGTHCONSTANT);
    }

    video.style.background = "rgba(0,0,0,0)";
    videoQuestions.style.background = "white";

    videoPlayer.style.padding = "4px";
    videoPlayer.style.textAlign = "justify";
    videoPlayer.style.display = "flex";
    videoPlayer.innerHTML = `<p>${videoParas[randomNum]}</p>`;

    populateUI();

    // Re-enable the button after the action is complete (e.g., after 1 second)
    setTimeout(() => {
      proceedBtn.disabled = false;
    }, 1000);
  } else {
    document.querySelector("#completedAllLevels").style.display = "block";
    instructions.style.display = "none";
    startDiv.style.display = "flex";
    proceedBtn.textContent = "Press backspace to return to village";

    correct.style.display = "none";
    wrong.style.display = "none";

    videoQuestions.style.display = "none";
    video.style.display = "none";
  }
});
