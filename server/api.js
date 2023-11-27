const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const OpenAI = require("openai");

app.use(bodyParser.json());

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

let todos = [
  { id: 1, title: "Example Todo 1", complete: false, importance: 3 },
  { id: 2, title: "Example Todo 2", complete: true, importance: 1 },
];

let previousTodos = [];

const sortTodos = () => {
  // todos.sort((a, b) => {
  //   if (a.complete === b.complete) {
  //     return b.importance - a.importance;
  //   }
  //   return a.complete - b.complete;
  // });
};

let getPrompt = async (action, todo, id, importance, customPrompt = "") => {
  let prompt = `You are a JSON editor. Given the current list: ${JSON.stringify(
    todos
  )}, `;

  switch (action) {
    case "add":
      prompt += `generate a new list with an added item titled "${todo}", importance: ${importance}, assigning a new unique id by auto-incrementing the last id in the list.`;
      break;
    case "update":
      prompt += `generate a new list where the item with id ${id} has its title changed to "${todo}".`;
      break;
    case "complete":
      prompt += `generate a new list where the item with id ${id} has its 'complete' status toggled.`;
      break;
    case "delete":
      prompt += `generate a new list where the item with id ${id} is removed.`;
      break;
    case "getOne":
      prompt += `extract and display the item with id ${id} from the list.`;
      break;
    case "custom":
      let customActionPrompt = `generate a new PROMPT based on this message: "${customPrompt}" that I can use to pass to an AI backend. it should follow this guideline: "generate a new list where each item from has a new title and assigned a new unique id by auto-incrementing the last id in the list. ' `;
      let response = await callApiForPromt(
        customActionPrompt + "return only the single PROMPT"
      ); // Call the API with the custom action prompt
      prompt += response.choices[0].message.content; // Append the generated message to the prompt
      break;
    default:
      return null; // Return null or you could throw an error or return a default message
  }

  return prompt;
};

// Create a todo
app.post("/todos", async (req, res) => {
  try {
    const { title, importance } = req.body;
    const prompt = await getPrompt("add", title, null, importance);

    const response = await callApi(prompt);
    const newTodo = JSON.parse(response.choices[0].message.content); // Assuming the API returns the expected JSON format

    todos.push(newTodo); // Add the new todo to the list
    sortTodos(); // Sort the list

    res.status(201).json({ message: "Todo created successfully", todos });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred - Create a todo",
      error: error.message,
    });
  }
});

// Update a todo
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    let prompt = await getPrompt("update", title, id, null);
    const response = await callApi(prompt);

    // Assuming that the API returns the updated list directly
    todos = JSON.parse(response.choices[0].message.content).todos;
    sortTodos();

    res.json({
      message: `Todo with id ${id} updated successfully`,
      todos,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

// Update a todo with custom prompt
app.put("/prompt", async (req, res) => {
  try {
    previousTodos = [...todos];
    const { prompt } = req.body; // Assume this is the custom prompt sent from the client

    let customPrompt = await getPrompt("custom", "", null, null, prompt);

    const response = await callApi(customPrompt);
    todos = JSON.parse(response.choices[0].message.content).todos; // Assuming the AI provides a valid JSON string

    res.json({
      message: `Custom prompt executed successfully`,
      todos,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred during custom prompting",
      error: error.message,
    });
  }
});

app.put("/undo", (req, res) => {
  if (previousTodos.length === 0) {
    return res.status(400).json({ error: "Nothing to undo" });
  }

  todos = previousTodos.pop(); // Assuming you want to undo one step at a time
  res.json({ message: "Last action undone successfully", todos });
});

app.put("/todos/:id/complete", async (req, res) => {
  try {
    const { id } = req.params;

    let prompt = await getPrompt("complete", "", id, null);
    const response = await callApi(prompt);

    todos = JSON.parse(response.choices[0].message.content).todos;
    sortTodos();

    res.json({
      message: `Todo with id ${id} completion status toggled successfully`,
      todos,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

// Delete a todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const prompt = await getPrompt("delete", "", id, null);
    const response = await callApi(prompt);

    todos = JSON.parse(response.choices[0].message.content).todos;
    sortTodos();

    res.json({
      message: `Todo with id ${id} deleted successfully`,
      todos,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

// Get a todo
app.get("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const prompt = await getPrompt("getOne", "", id);

  try {
    const response = await callApi(prompt);
    const todo = JSON.parse(response.choices[0].message.content); // Assuming the API returns just the requested todo

    res.json({ todo });
  } catch (err) {
    res.status(500).json({
      message: "An error occurred - getting a todo",
      error: err.message,
    });
  }
});

// Get all todos
app.get("/todos", (req, res) => {
  res.json(todos);
});

const openai = new OpenAI({
  apiKey: "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",
});

const callApi = async (prompt) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: "You are a helpful todo assistant designed to output JSON.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
      stream: false,
    });
    return response;
  } catch (error) {
    console.error("API call failed: ", error);
    throw new Error("API call failed: " + error.message);
  }
};

const callApiForPromt = async (prompt) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful prompt assistant designed to output prompts an no other information.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000,
      stream: false,
    });
    return response;
  } catch (error) {
    console.error("API call failed: ", error);
    throw new Error("API call failed: " + error.message);
  }
};

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
