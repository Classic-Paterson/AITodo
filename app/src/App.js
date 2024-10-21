import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, Typography, CircularProgress, Container } from "@shadcn/ui";
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

  const undoLastPrompt = async () => {
    showLoading();
    setError(false);
    try {
      const res = await fetch(`http://localhost:3000/undo`, {
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

  return (
    <Container>
      <Typography variant="h1" align="center" gutterBottom>
        AI Todo
      </Typography>
      <PromptForm executePrompt={executePrompt} undoLastPrompt={undoLastPrompt} />
      {loading && (
        <div className="loading text-gray-600 text-center pt-3">
          <CircularProgress />
        </div>
      )}
      {!loading && todos?.length > 0 && (
        <Card>
          <CardContent>
            <TodoList todos={todos} deleteTodo={deleteTodo} completeTodo={completeTodo} />
          </CardContent>
        </Card>
      )}
      {error && !loading && (
        <div className="loading text-gray-600 text-center pt-3">
          Somethin' aint right...
        </div>
      )}
    </Container>
  );
};

export default App;
