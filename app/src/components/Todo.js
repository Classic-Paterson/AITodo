import React from "react";
import { TableRow } from "@shadcn/ui";
import TodoProperties from "./TodoProperties";
import TodoActions from "./TodoActions";

const Todo = ({ todo, deleteTodo, completeTodo }) => {
  return (
    <TableRow className="hover:bg-gray-100">
      <TodoProperties todo={todo} />
      <TodoActions todo={todo} deleteTodo={deleteTodo} completeTodo={completeTodo} />
    </TableRow>
  );
};

export default Todo;
