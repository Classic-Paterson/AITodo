import React from "react";
import { Button, IconButton } from "@shadcn/ui";
import { TrashIcon, CheckIcon, XIcon } from "@shadcn/icons";

const TodoActions = ({ todo, deleteTodo, completeTodo }) => {
  const handleDelete = (e) => {
    e.preventDefault();
    deleteTodo(todo.id);
  };

  const handleComplete = (e) => {
    e.preventDefault();
    completeTodo(todo.id);
  };

  return (
    <td className="text-right">
      <div className="w-full">
        <IconButton onClick={handleDelete} className="bg-red-500 text-white hover:bg-red-600 mr-2">
          <TrashIcon />
        </IconButton>
        <IconButton
          onClick={handleComplete}
          className={`rounded ${todo.complete ? "bg-yellow-500" : "bg-green-500"} text-white mr-2 ${
            todo.complete ? "hover:bg-yellow-600" : "hover:bg-green-600"
          }`}
        >
          {todo.complete ? <XIcon /> : <CheckIcon />}
        </IconButton>
      </div>
    </td>
  );
};

export default TodoActions;
