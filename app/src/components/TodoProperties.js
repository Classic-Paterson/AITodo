import React from "react";

const TodoProperties = ({ todo }) => {
  return (
    <>
      {Object.values(todo).map((value) => (
        <td className={`px-6 py-4 capitalize ${todo.complete ? "line-through" : ""} ${todo.important ? "font-bold" : ""}`}>
        {value ? value.toString() : ""}
      </td>
      ))}
    </>
  );
};

export default TodoProperties;
