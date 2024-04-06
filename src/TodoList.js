// TodoList.js

import React, { useState, useEffect } from "react";
import axios from "axios";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [editingTodo, setEditingTodo] = useState(null); // Track the currently edited todo
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedCompleted, setUpdatedCompleted] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    axios
      .get("http://localhost:8080/api/v1/todos")
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
      });
  };

  const handleAddTodo = () => {
    // Make a POST request to add a new todo
    axios
      .post("http://localhost:8080/api/v1/todos", { title: newTodoTitle })
      .then(() => {
        // Refresh the todos list
        fetchTodos();
        setNewTodoTitle("");
      })
      .catch((error) => {
        console.error("Error adding todo:", error);
      });
  };

  const handleEditTodo = (id, title, completed) => {
    // Set the currently edited todo
    setEditingTodo({ id, title, completed });
  };

  const handleSaveEdit = () => {
    // Make a PUT request to update the edited todo
    axios
      .put(`http://localhost:8080/api/v1/todos/${editingTodo.id}`, {
        title: updatedTitle,
        completed: updatedCompleted,
      })
      .then(() => {
        // Refresh the todos list
        fetchTodos();
        setEditingTodo(null); // Clear the editing state
      })
      .catch((error) => {
        console.error("Error updating todo:", error);
      });
  };

  const handleDeleteTodo = (id) => {
    // Make a DELETE request to delete a todo
    axios
      .delete(`http://localhost:8080/api/v1/todos/${id}`)
      .then(() => {
        // Refresh the todos list
        fetchTodos();
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">TODO LIST</h1>
      <form onSubmit={handleAddTodo} className="mb-4 flex">
        <input
          type="text"
          placeholder="Enter a new todo"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          className="p-2 border rounded flex-grow mr-2"
        />
        <button
          type="submit"
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Todo
        </button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="border mb-1 p-2 flex justify-between items-center"
          >
            {editingTodo && editingTodo.id === todo.id ? (
              <div>
                <input
                  type="text"
                  value={updatedTitle}
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                  className="p-2 border rounded mr-2"
                />
                <label className="flex items-center">
                  Completed:
                  <input
                    type="checkbox"
                    checked={updatedCompleted}
                    onChange={() => setUpdatedCompleted(!updatedCompleted)}
                    className="ml-2"
                  />
                </label>
                <button
                  onClick={handleSaveEdit}
                  className="bg-green-500 text-white px-2 py-1 rounded ml-2"
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                {todo.title} {todo.completed ? "(Completed)" : "(Pending)"}
                <button
                  onClick={() =>
                    handleEditTodo(todo.id, todo.title, todo.completed)
                  }
                  className="text-blue-500 hover:underline ml-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="text-red-500 hover:underline ml-2"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
