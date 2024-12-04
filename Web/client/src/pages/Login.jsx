import React, { useState } from "react";
import img from "../assets/login-img.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const Login = () => {
  const { login, isLoggedIn } = useAuth(); // Use the login function from AuthContext
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const data = await response.json();
      login(data.user_id);
      console.log(isLoggedIn)
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <img src={img} className="basis-[50%]" alt="Login" />
      <div className="basis-[50%] my-[10rem] gap-4 flex flex-col items-center">
        <h2 className="text-3xl font-semibold border-b-2 pb-2 border-y-yellow-950 max-h-max">
          Welcome Back!
        </h2>
        <form
          className="w-[60%] flex flex-col gap-[2rem]"
          onSubmit={handleLogin}
        >
          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="ex: imed@example.com"
              className="border-b pb-1 border-yellow-950 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="*********"
              className="border-b pb-1 border-yellow-950 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <button
            className="w-full bg-yellow-950 px-3 py-2 text-white min-w-max hover:opacity-85"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
