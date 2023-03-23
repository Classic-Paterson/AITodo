const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const fetch = require("node-fetch");

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

let todos = [
  { id: 1, title: "Example Todo 1", complete: false, importance: 3 },
  { id: 2, title: "Example Todo 2", complete: true, importance: 1 },
];

let previousTodos = [];

const sortTodos = () => {
  todos.sort((a, b) => {
    if (a.complete === b.complete) {
      return b.importance - a.importance;
    }
    return a.complete - b.complete;
  });
};


let getPrompt = (action, todo, id, importance) => {
  let prompt = `Given the state of this store: ${JSON.stringify(todos)}, `;

  switch (action) {
    case "add":
      prompt += `add a new item with the title: ${todo}, importance: ${importance}, and auto increment the id`;
      break;

    case "update":
      prompt += `what should the new state of my array be after a the item with the id: ${id} has its title updated to title: ${todo}`;
      break;

    case "complete":
      prompt += `what should the new state of my array be after a the item with the id: ${id} has it's 'complete' status set to the opposite of what it is now`;
      break;

    case "delete":
      prompt += `what should the new state of my array be after the item with the id: ${id} is removed`;
      break;

    case "getOne":
      prompt += `give me the item with the id: ${id}`;
      break;

    default:
      return null;
  }

  return `${prompt}? Provide your answer in JSON form ensuring that each item has an 'id' and a 'title' property and no other values are changed from the existing array if not explicitly told to. Ensure that the 'title' property adheres to correct grammar, proper capitalization, and spelling. Reply with only the answer in JSON form and include no other commentary.`;
};

// Create a todo
app.post("/todos", async (req, res) => {
  try {
    const { todo, importance } = req.body;
    const prompt = getPrompt("add", todo, importance);

    const response = await callApi(prompt);
    const data = await response.json();

    todos = JSON.parse(data.choices[0].message.content);
    sortTodos();

    res.status(201).json({ message: "Todo created successfully", todos });
  } catch (error) {
    res.status(500).json({ message: "An error occured" });
  }
});


// Update a todo
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { todo } = req.body;

    let prompt = getPrompt("update", todo, id, null);
    const response = await callApi(prompt);

    const data = await response.json();
    const returnData = data.choices[0].message.content;
    todos = JSON.parse(returnData);
    sortTodos();

    res.json({
      message: `Todo with id ${id} updated successfully`,
      todos,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occured" });
  }
});

// Update a todo
app.put("/prompt", async (req, res) => {
  try {
    previousTodos = [...todos];
    const { prompt } = req.body;
    let sneekyPrompt = `Given the state of this store: ${JSON.stringify(
      todos
      )}, what should the new state of my array be after performing the following ${prompt}? Provide your answer in JSON form ensuring that each item has an 'id' and a 'title' property and no other values are changed from the existing array if not explicitly told to. Reply with only the answer in JSON form and include no other commentary.`;
      
      const response = await callApi(sneekyPrompt);

    const data = await response.json();
    const returnData = data.choices[0].message.content;
    todos = JSON.parse(returnData);

    res.json({
      message: `Prompt ${prompt} successfully executed`,
      todos,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occured" });
  }
});

app.put('/undo', (req, res) => {
  if (previousTodos.length === 0) {
    return res.status(400).json({ error: 'Nothing to undo' });
  }

  todos = previousTodos;
  previousTodos = [];
  res.json({ todos });
});

app.put("/todos/:id/complete", async (req, res) => {
  try {
    const { id } = req.params;
    const { todo } = req.body;

    let prompt = getPrompt("complete", todo, id, null);
    const response = await callApi(prompt);

    const data = await response.json();
    const generatedTodo = data.choices[0].message.content;
    todos = JSON.parse(generatedTodo);

    res.json({
      message: `Todo with id ${id} completed successfully`,
      todos,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occured" });
  }
});

// Delete a todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const prompt = getPrompt("delete", "", id, null);
    const response = await callApi(prompt);
    const data = await response.json();
    todos = JSON.parse(data.choices[0].message.content);
    sortTodos();


    res.json({
      message: `Todo with id ${id} deleted successfully`,
      todos,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occured" });
  }
});

// Get a todo
app.get("/todos/:id", async (req, res) => {
  const id = req.params.id;
  const prompt = getPrompt("getOne", "", id);

  try {
    const response = await callApi(prompt);
    const data = await response.json();

    const todo = JSON.parse(data.choices[0].message.content);

    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: "An error occured" });
  }
});

// Get all todos
app.get("/todos", (req, res) => {
  res.json(todos);
});

const callApi = async (prompt) => {

  const API_URL = "https://api.openai.com/v1/chat/completions";
  const API_KEY = process.env.OPEN_AI_API_KEY;
  try {

    return fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 2000,
        stream: false,
        n: 1,
      }),
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "An error occured" });
  }
};

app.listen(3000, () => {
  console.log("Server started on port 3000");
});