import React from "react";
import TodoProperties from "./TodoProperties";
import TodoActions from "./TodoActions";

const Todo = ({ todo, deleteTodo, completeTodo }) => {
  return (
    <tr className="hover:bg-gray-100">
      <TodoProperties todo={todo} />
      <TodoActions todo={todo} deleteTodo={deleteTodo} completeTodo={completeTodo} />
    </tr>
  );
};

export default Todo;
