import React from "react";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@shadcn/ui";
import Todo from "./Todo";

const TodoList = ({ todos, deleteTodo, completeTodo }) => (
  <Table>
    <TableHead>
      <TableRow>
        {Object.keys(todos[0]).map((key) => (
          <TableCell key={key}>{key}</TableCell>
        ))}
        <TableCell></TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {todos.map((todo) => (
        <Todo key={todo.id} todo={todo} deleteTodo={deleteTodo} completeTodo={completeTodo} />
      ))}
    </TableBody>
  </Table>
);

export default TodoList;
