"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [todos, setTodos] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");

  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");

    // 🔐 Protect route
    if (!user) {
      window.location.href = "/login";
    } else {
      fetchTodos();
    }
  }, []);

  const addTodo = async () => {
    if (!title || !deadline) {
      alert("Please fill all fields");
      return;
    }

    await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, deadline }),
    });

    setTitle("");
    setDeadline("");
    fetchTodos();
  };

  const deleteTodo = async (id: string) => {
    await fetch("/api/todos", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    fetchTodos();
  };

  const toggleComplete = async (id: string, currentStatus: boolean) => {
    await fetch("/api/todos", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        completed: !currentStatus,
      }),
    });

    fetchTodos();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-6">

      {/* 🔥 Header */}
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Todo App</h1>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      {/* Input Section */}
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">
        
        <input
          className="w-full p-3 rounded-lg bg-slate-700 outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter todo"
        />

        <input
          type="date"
          className="w-full p-3 rounded-lg bg-slate-700 outline-none"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <button
          onClick={addTodo}
          className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-semibold"
        >
          Add Todo
        </button>
      </div>

      {/* Todo List */}
      <div className="w-full max-w-md mt-6 space-y-4">
        {todos.map((todo) => {
          const today = new Date();
          const deadlineDate = new Date(todo.deadline);

          const diffTime = deadlineDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          return (
            <div
              key={todo._id}
              className="bg-slate-800 p-4 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <h2
                  className={`font-semibold text-lg ${
                    todo.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {todo.title}
                </h2>

                <p className="text-sm text-gray-400">
                  {diffDays > 0
                    ? `${diffDays} day${diffDays > 1 ? "s" : ""} left`
                    : "Deadline passed"}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    toggleComplete(todo._id, todo.completed)
                  }
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                >
                  {todo.completed ? "Undo" : "Complete"}
                </button>

                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
