const cors = require("cors");

// Importing dependencies and setting up http server
const express = require("express"),
  body_parser = require("body-parser"),
  axios = require("axios").default,
  app = express().use(body_parser.json());

app.use(cors({ origin: "*" }));

let port = 7890;
ip = "0.0.0.0";
app.listen(port);
console.log("Server running on http://%s:%s", ip, port);
// console.log("Server running on http://localhost:7890");

app.get("/", async (req, res) => {
  console.log("Basic route requested");

  res.send({
    result:
      "Node js server for handling the backend requests. (By the way, we are going to win this event for sure)",
    error: "Not making any errors",
  });
});

let accessToken = null;
let tokenExpiration = null;

async function getAccessToken() {
  if (!accessToken || Date.now() >= tokenExpiration) {
    console.log("Old token expired! Generating a new token");

    // Token has expired or doesn't exist, generate a new one
    try {
      const response = await axios.post(
        "https://iam.cloud.ibm.com/identity/token",
        new URLSearchParams({
          grant_type: "urn:ibm:params:oauth:grant-type:apikey",
          apikey: process.env.API_KEY,
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const data = response.data;
      accessToken = data.access_token;
      tokenExpiration = Date.now() + data.expires_in * 1000; // expires_in is in seconds

      return accessToken;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  console.log("Old token still valid! Using the old token");
  return accessToken;
}

// grabbing 'easy' questions for the same
app.post("/generateFilpTheTileQuestions", async (req, res) => {
  const subject = req.body?.subject || null;

  if (!subject || subject == "") {
    return res.send({
      result: null,
      error:
        "Topic around which the questions have to be provided is missing!!",
    });
  }

  console.log(
    `Grabbing the Granite models output for Flip the tiles game, for the topic: ${subject}`
  );

  const token = await getAccessToken();

  let data = JSON.stringify({
    input: `Input: 2 objects for the topic: art\nOutput: [\n  {\n    "value": "artImage.color theory.primary",\n    "isVisited": false,\n    "brief": {\n      "reasoning": "Primary colors—red, blue, and yellow—are foundational in art. All other colors are derived by mixing these three."\n    }\n  },\n  {\n    "value": "artImage.perspective.linear",\n    "isVisited": false,\n    "brief": {\n      "reasoning": "Linear perspective is a technique in drawing that creates depth by converging lines at a single point on the horizon."\n    }\n  }\n]\n\nInput: 1 object for the topic: dsa\nOutput: [\n  {\n    "value": "dsaImage.binary search tree.balanced",\n    "isVisited": false,\n    "brief": {\n      "reasoning": "A balanced binary search tree maintains log(n) height, enabling efficient operations like insertion, deletion, and lookup with minimal time complexity."\n    }\n  }\n]\n\nInput: 9 objects for the topic: ${subject}\nOutput:`,
    parameters: {
      decoding_method: "sample",
      max_new_tokens: 3000,
      min_new_tokens: 0,
      random_seed: null,
      stop_sequences: ["]", "Input:"],
      temperature: 0.7,
      top_k: 50,
      top_p: 1,
      repetition_penalty: 1,
    },
    model_id: "ibm/granite-3-8b-instruct",
    project_id: process.env.PROCESS_ID,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      // it will be an array of questions
      let questions = JSON.parse(response.data.results[0].generated_text);

      res.send({
        result: questions,
        error: null,
      });
    })
    .catch((error) => {
      console.log(error);
      res.send({
        result: null,
        error: error?.response?.data || "Server error",
      });
    });
});

// it is consuming 6-7k tokens in a single run, so used it only once to grab the questions
// for generating the "q&a" stuff
app.post("/generateQaQuestions", async (req, res) => {
  const subject = req.body?.subject || null;

  if (!subject || subject == "") {
    return res.send({
      result: null,
      error:
        "Topic around which the questions have to be provided is missing!!",
    });
  }

  console.log(
    `Grabbing the Granite models output for Q&A game, for the topic: ${subject}`
  );

  const token = await getAccessToken();

  let data = JSON.stringify({
    input: `Input: Topic: environment\nPara length: 40 words\nQuestions for each para\nOutput: {\n  "paragraphs": [\n    "The Earth\'\'\'s atmosphere is divided into multiple layers, each serving a unique purpose. The troposphere, the lowest layer, extends only a few miles above the Earth\'\'\'s surface and is where all weather events occur. Above it, the stratosphere contains the ozone layer, which absorbs harmful ultraviolet radiation.<br><br>Airplanes prefer flying in the stratosphere as it offers a stable environment with minimal turbulence.",\n    "Beneath our feet, soil is home to a vast and invisible ecosystem. A single gram of soil can contain tens of thousands of microorganisms, including bacteria, fungi, and tiny worms. The famous scientist Charles Darwin extensively studied earthworms, realizing their importance in enriching the soil."\n  ],\n  "questions": [\n    {\n    "type": "environment",\n    "used": false,\n    "videoQuestions": {\n      "0": {\n        "q": "Which layer carries electrical charges?",\n        "o": ["Atmosphere", "Thermosphere", "Stratosphere", "Exosphere"],\n        "ans": "Thermosphere",\n      },\n      "1": {\n        "q": "What is the range of Troposphere?",\n        "o": ["50-75 miles", "30-35 miles", "4-10 miles", "above 400 miles"],\n        "ans": "4-10 miles",\n      },\n      "2": {\n        "q": "Why aeroplanes fly in the Stratosphere?",\n        "o": [\n          "No weather disturbances",\n          "Ions presence",\n          "Low temperature",\n          "High lift",\n        ],\n        "ans": "No weather disturbances",\n      },\n      "3": {\n        "q": "Layer which blocks out UV rays",\n        "o": ["Thermosphere", "Stratosphere", "Troposphere", "Exosphere"],\n        "ans": "Stratosphere",\n      },\n    },\n  },\n{\n    "type": "environment",\n    "used": false,\n    "videoQuestions": {\n      "0": {\n        "q": "In a single gram of soil, how many micro-organisms can be found?",\n        "o": ["5k", "150k", "10k", "50k"],\n        "ans": "50k",\n      },\n      "1": {\n        "q": "Which was fascinated by the importance of earthworms?",\n        "o": ["Aristotle", "Linnaeus", "Mendel", "Darwin"],\n        "ans": "Darwin",\n      },\n      "2": {\n        "q": "How much soil is made in 100 years?",\n        "o": ["15mm", "5mm", "100mm", "7.5mm"],\n        "ans": "5mm",\n      },\n      "3": {\n        "q": "Oldest found soil is present in?",\n        "o": ["India", "Australia", "South Africa", "UK"],\n        "ans": "South Africa",\n      },\n    },\n  }\n  ]\n}\n\nInput: Topic: ${subject}\nPara length: 30 words\n2 para, 8 questions (4 for each question)\nOutput:`,
    parameters: {
      decoding_method: "sample",
      max_new_tokens: 1000,
      min_new_tokens: 0,
      random_seed: null,
      stop_sequences: ["\n\n", "\n\n\n"],
      temperature: 0.7,
      top_k: 63,
      top_p: 0.85,
      repetition_penalty: 1,
    },
    model_id: "ibm/granite-3-8b-instruct",
    project_id: process.env.PROCESS_ID,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      const modelOutput = response.data.results[0].generated_text;

      res.send({
        result: modelOutput,
        error: null,
      });
    })
    .catch((error) => {
      console.log(error);

      res.send({
        result: null,
        error: error?.response?.data || "Server error",
      });
    });
});

app.post("/getCareerGuidance", async (req, res) => {
  const params = req.body?.params || null;

  if (!params || params == "") {
    return res.send({
      result: null,
      error: "Parameters are missing",
    });
  }

  console.log(`Grabbing the Granite models output for career guidance`);

  const token = await getAccessToken();

  let data = JSON.stringify({
    input: `Input: Right triplets: 18 \nWrong triplets: 2\nMazes completed: 5\nTimes ran out: 3\nVideo levels completed: 10\n\nSuggested Subjects: math, dsa, environment\nOutput: {\n  "originality": 85,\n  "innovation": 70,\n  "creativity": 80,\n  "career_paths": [\n    "Data Scientist (Environment/Math focused)",\n    "Algorithm Designer (DSA/Math)",\n    "Environmental Modeler (Math/Environment)",\n    "Software Engineer (DSA)",\n    "Quantitative Analyst"\n  ],\n  "improvements": [\n    "Challenge yourself to think beyond conventional solutions when problem-solving, actively seeking out non-obvious or unconventional approaches.",\n    "Develop a habit of exploring the interconnectedness of different concepts and fields, as this can lead to more innovative ideas and solutions.",\n    "Continuously seek out new information and learn from diverse sources to expand your knowledge base and fuel creative thinking."\n  ]\n}\n\nInput: ${params}\nOutput:`,
    parameters: {
      decoding_method: "sample",
      max_new_tokens: 250,
      min_new_tokens: 0,
      random_seed: null,
      stop_sequences: ["}"],
      temperature: 0.7,
      top_k: 50,
      top_p: 1,
      repetition_penalty: 1,
    },
    model_id: "ibm/granite-3-8b-instruct",
    project_id: process.env.PROCESS_ID,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      const modelOutput = response.data.results[0].generated_text;

      res.send({
        result: JSON.parse(modelOutput),
        error: null,
      });
    })
    .catch((error) => {
      console.log(error);

      res.send({
        result: null,
        error: error?.response?.data || "Server error",
      });
    });
});
