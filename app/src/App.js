import React, { useState, useEffect } from "react";
import PromptForm from "./components/PromptForm";
import TodoList from "./components/TodoList";

const App = () => {
  const [todos, setTodos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  const fetchTodos = async () => {
    showLoading();
    setError(false);

    try {
      const res = await fetch("http://localhost:3000/todos");
      const data = await res.json();
      console.log("todos", data)
      setTodos(data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      hideLoading();
    }
  };

  const executePrompt = async (prompt) => {
    showLoading();
    setError(false);

    try {
      const res = await fetch(`http://localhost:3000/prompt`, {
        method: "PUT",
        body: JSON.stringify({ prompt }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setTodos(data.todos);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      hideLoading();
    }
  };

  const deleteTodo = async (id) => {
    showLoading();
    setError(false);

    try {
      const res = await fetch(`http://localhost:3000/todos/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      setTodos(data.todos);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      hideLoading();
    }
  };

  const completeTodo = async (id) => {
    showLoading();
    setError(false);

    try {
      const res = await fetch(`http://localhost:3000/todos/${id}/complete`, {
        method: "PUT",
      });
      const data = await res.json();
      setTodos(data.todos);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl mx-auto max-w-3xl my-10">
      <h1 className="text-4xl font-bold text-center mb-2">AI Todo</h1>
      <PromptForm executePrompt={executePrompt} />
      {loading && <div className="loading text-gray-600 text-center pt-3">Loading...</div>}
      {!loading &&  todos?.length > 0 && <TodoList todos={todos} deleteTodo={deleteTodo} completeTodo={completeTodo} />}
      {error && !loading && <div className="loading text-gray-600 text-center pt-3">Somethin' aint right...</div>}
    </div>
  );
};

export default App;
