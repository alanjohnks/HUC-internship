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
    fetchTodos();
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

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-6">
      
     

      
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
                <h2 className="font-semibold text-lg">{todo.title}</h2>
                <p className="text-sm text-gray-400">
                  {diffDays > 0
                    ? `${diffDays} day${diffDays > 1 ? "s" : ""} left`
                    : "Deadline passed"}
                </p>
              </div>

              <button
                onClick={() => deleteTodo(todo._id)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm"
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
