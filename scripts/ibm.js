// style the analysis elements
const analysisColors = ["#83d32c", "#045b7c", "#04b3cb", "#13335b"];
let selectedAnswers = "";
let subjectsArray = [];

document.querySelectorAll("#initialAnalysis > div").forEach((divs, ind) => {
  Object.assign(divs.style, {
    padding: "4px",
    width: "200px",
    height: "220px",
    display: "flex",
    borderRadius: "5%",
    alignItems: "center",
    flexDirection: "column",
    backdropFilter: "blur(3px)",
    justifyContent: "flex-start",
    border: `4px solid ${analysisColors[ind]}`,
    background: "rgba(255, 255, 255, 0.6)",
  });

  // styling the inner para for the question
  Object.assign(divs.querySelector("p").style, {
    color: "white",
    height: "20%",
    padding: "4px",
    textAlign: "center",
    borderRadius: "10px",
    alignContent: "spaceAround",
    background: analysisColors[ind],
  });

  // selecting one of the options
  divs.querySelectorAll("#options > p").forEach((options) => {
    options.addEventListener("click", (option) => {
      const chosenTrait = option.target.getAttribute("id").split("-")[1];

      // resetting other stylings
      if (option.target.getAttribute("class") == "o1") {
        selectedAnswers = selectedAnswers.replaceAll(
          Number(chosenTrait) + 1,
          ""
        );
        divs.querySelectorAll("#options > p")[2].style.background = "none";
        divs.querySelectorAll("#options > p")[2].style.color = "white";
      } else {
        selectedAnswers = selectedAnswers.replaceAll(
          Number(chosenTrait) - 1,
          ""
        );
        divs.querySelectorAll("#options > p")[0].style.background = "none";
        divs.querySelectorAll("#options > p")[0].style.color = "white";
      }

      selectedAnswers += chosenTrait;
      findSuitableSubjects(selectedAnswers);

      option.target.style.background = analysisColors[ind];

      // if the bgd color is dark
      if (divs.getAttribute("class")?.includes("dark"))
        option.target.style.color = "auto";
    });
  });
});

const traitsAndSubjectMap = {
  "0246": "043",
  "0247": "041",
  "0256": "435",
  "0257": "451",
  "0346": "023",
  "0347": "021",
  "0356": "235",
  "0357": "251",
  1246: "104",
  1247: "104",
  1256: "145",
  1257: "145",
  1346: "120",
  1347: "120",
  1356: "123",
  1357: "125",
};

function findSuitableSubjects(searchString, dataObject = traitsAndSubjectMap) {
  let matchingValues = [];

  // Convert search string to a set of characters
  const searchChars = new Set(searchString);

  for (let key in dataObject) {
    if (dataObject.hasOwnProperty(key)) {
      // Convert key to a set of characters
      let keyChars = new Set(key);
      let allCharsFound = true;

      // Check if all characters from searchString are present in the key
      for (let char of searchChars) {
        if (!keyChars.has(char)) {
          allCharsFound = false;
          // No need to continue checking if one char is missing
          break;
        }
      }

      if (allCharsFound) {
        matchingValues.push(dataObject[key]);
      }
    }
  }

  // using a set to collect unique characters from the matching values
  let uniqueChars = new Set();
  matchingValues.forEach((value) => {
    for (let char of value) {
      uniqueChars.add(char);
    }
  });

  document.querySelectorAll("#subjectToChooseFrom > p").forEach((subject) => {
    subject.classList.remove("color-changing-border");
    subject.style.color = "gray";
  });

  uniqueChars.forEach((char) => {
    document.querySelector(`#s${char}`).classList.add("color-changing-border");
    document.querySelector(`#s${char}`).style.color = "black";
  });

  if (selectedAnswers.length == 4) {
    // resetting, so that at a time, only 3 subjects are there
    subjectsArray = [];
    document
      .querySelectorAll("#subjectToChooseFrom > p")
      .forEach((subject, ind) => {
        if (Array.from(uniqueChars).join("").includes(ind)) {
          subjectsArray.push(subject.getAttribute("data-subject"));
          subject.style.display = "block";
        } else subject.style.display = "none";
      });
    document.querySelector("#gameBtn").style.pointerEvents = "auto";
  }
}
