import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

export default function AuthSidePanel({ open, mode, onClose }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (mode === "register" && !form.name) {
      setError("Name is required");
      return;
    }
    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }
    if (mode === "register") {
      setLoading(true);
      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/user/signup`, {
          name: form.name,
          email: form.email,
          password: form.password
        });
        // Assume response contains user and token
        login(res.data.user, res.data.token);
        setForm({ name: "", email: "", password: "" });
        setError("");
        onClose();
      } catch (err) {
        setError(err.response?.data?.message || "Registration failed");
      } finally {
        setLoading(false);
      }
      return;
    }
    if (mode === "login") {
      setLoading(true);
      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/user/signin`, {
          email: form.email,
          password: form.password
        });
        // Assume response contains user and token
        login(res.data.user, res.data.token);
        setForm({ name: "", email: "", password: "" });
        setError("");
        onClose();
      } catch (err) {
        setError(err.response?.data?.message || "Login failed");
      } finally {
        setLoading(false);
      }
      return;
    }
    // fallback (should not reach here)
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
            className="border border-black p-2 rounded text-black"
            autoComplete="off"
            disabled={loading}
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border border-black p-2 rounded text-black"
          autoComplete="off"
          disabled={loading}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border border-black p-2 rounded text-black"
          autoComplete="off"
          disabled={loading}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button type="submit" className="bg-yellow-500 text-black py-2 rounded font-bold" disabled={loading}>
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
        </button>
      </form>
    </div>
  );
} 