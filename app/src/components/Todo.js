import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

const Todo = ({ todo, deleteTodo, completeTodo }) => {
  const handleDelete = (e) => {
    e.preventDefault();
    deleteTodo(todo.id);
  };

  const handleComplete = (e) => {
    e.preventDefault();
    completeTodo(todo.id);
  };

  return (
    <tr className="hover:bg-gray-100">
      {Object.values(todo).map((value) => (
        <td className={`px-6 py-4 capitalize ${todo.complete ? "text-decoration-line: line-through" : ""} ${todo.important ? "font-bold" : ""}`}>{value.toString()}</td>
      ))}
      <td className="text-right">
        <div className="w-full">
          <button onClick={handleDelete} className="rounded bg-red-500 text-white py-2 px-4 hover:bg-red-600 mr-2">
            <FontAwesomeIcon icon={faTrash} />
          </button>
          <button
            onClick={handleComplete}
            className={`rounded ${todo.complete ? "bg-yellow-500" : "bg-green-500"} text-white py-2 px-4 mr-2 ${
              todo.complete ? "hover:bg-yellow-600" : "hover:bg-green-600"
            }`}
          >
            <div style={{ width: "1rem", height: "1.5rem" }}>
              {todo.complete ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faCheck} />}
            </div>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default Todo;
