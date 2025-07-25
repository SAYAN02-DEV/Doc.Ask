import React, { useState } from "react";
import { useAuth } from "./AuthContext";

export default function AuthSidePanel({ open, mode, onClose }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "register" && !form.name) {
      setError("Name is required");
      return;
    }
    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }
    // Simulate login/register (no API)
    const userData = mode === "register" ? { name: form.name, email: form.email } : { email: form.email };
    login(userData, "dummy_token");
    setForm({ name: "", email: "", password: "" });
    setError("");
    onClose();
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      style={{ boxShadow: open ? "-4px 0 24px rgba(0,0,0,0.2)" : "none" }}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">{mode === "login" ? "Login" : "Register"}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
      </div>
      <form className="p-6 flex flex-col gap-4" onSubmit={handleSubmit}>
        {mode === "register" && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded"
            autoComplete="off"
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded"
          autoComplete="off"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border p-2 rounded"
          autoComplete="off"
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button type="submit" className="bg-yellow-500 text-black py-2 rounded font-bold">
          {mode === "login" ? "Login" : "Register"}
        </button>
      </form>
    </div>
  );
} 