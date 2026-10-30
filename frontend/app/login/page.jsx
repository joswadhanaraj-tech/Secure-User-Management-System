"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Clear session storage on mount for fresh login unless user explicitly stored token
    try {
      if (!sessionStorage.getItem("access_token") && !localStorage.getItem("access_token")) {
        sessionStorage.removeItem("access_token");
      }
    } catch (e) {}
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError("");
    setSuccess("");
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);

      const res = await axios.post("http://127.0.0.1:8000/token", params.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 5000,
      });

      setToken(res.data.access_token);
      setSuccess("Login successful — redirecting...");
      // store token per remember choice
      try {
        if (remember) localStorage.setItem("access_token", res.data.access_token);
        else sessionStorage.setItem("access_token", res.data.access_token);
      } catch (e) {}

      setTimeout(() => router.replace("/"), 400);
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">Welcome back to Grow Higher</h2>
          <p className="text-sm text-gray-500">Sign in to manage your inventory</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
          {success && <div className="text-sm text-green-700 bg-green-50 p-2 rounded">{success}</div>}

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email or username</span>
            <input
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="you@example.com"
              autoComplete="username"
              disabled={loading}
            />
          </label>

          <label className="block">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Password</span>
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="text-xs text-teal-600 hover:underline"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              disabled={loading}
            />
          </label>

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center text-sm">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="mr-2" />
              Remember me
            </label>
            <a className="text-sm text-teal-600 hover:underline" href="#">Forgot?</a>
          </div>

          <div>
            <button
              type="submit"
              className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:opacity-60"
              disabled={loading}
            >
              {loading && <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>}
              Sign in
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Don’t have an account? <a className="text-teal-600 hover:underline" href="#">Contact admin</a>
        </div>
      </div>
    </div>
  );
}

