import Todo from "./Todo";

const TodoList = ({ todos, deleteTodo, completeTodo }) => (
  <table className="min-w-full divide-y divide-gray-200 p-4 rounded-lg">
    <thead className="bg-gray-50">
      <tr>
        {Object.keys(todos[0]).map((key) => (
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {key}
          </th>
        ))}
        <th scope="col"></th>
      </tr>
    </thead>
    <tbody>
      {todos.map((todo) => (
        <Todo key={todo.id} todo={todo} deleteTodo={deleteTodo} completeTodo={completeTodo} />
      ))}
    </tbody>
  </table>
);

export default TodoList;
