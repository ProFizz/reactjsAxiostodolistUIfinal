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
    <div>
      <h1>Todo List</h1>
      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          placeholder="Enter a new todo"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
        />
        <button type="submit">Add Todo</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {editingTodo && editingTodo.id === todo.id ? (
              <div>
                <input
                  type="text"
                  value={updatedTitle}
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                />
                <label>
                  Completed:
                  <input
                    type="checkbox"
                    checked={updatedCompleted}
                    onChange={() => setUpdatedCompleted(!updatedCompleted)}
                  />
                </label>
                <button onClick={handleSaveEdit}>Save</button>
              </div>
            ) : (
              <div>
                {todo.title} {todo.completed ? "(Completed)" : "(Pending)"}
                <button
                  onClick={() =>
                    handleEditTodo(todo.id, todo.title, todo.completed)
                  }
                >
                  Edit
                </button>
                <button onClick={() => handleDeleteTodo(todo.id)}>
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
