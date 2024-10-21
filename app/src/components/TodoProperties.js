import React from "react";
import { TableCell } from "@shadcn/ui";

const TodoProperties = ({ todo }) => {
  return (
    <>
      {Object.values(todo).map((value) => (
        <TableCell className={`px-6 py-4 capitalize ${todo.complete ? "line-through" : ""} ${todo.important ? "font-bold" : ""}`}>
        {value ? value.toString() : ""}
      </TableCell>
      ))}
    </>
  );
};

export default TodoProperties;
