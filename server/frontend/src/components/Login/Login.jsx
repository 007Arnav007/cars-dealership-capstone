import React, { useState } from "react";

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch("/djangoapp/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, password }),
    });
    const json = await res.json();
    if (json.status === "Authenticated") {
      sessionStorage.setItem("username", json.userName);
      window.location.href = "/";
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="card-box mx-auto" style={{ maxWidth: 420 }}>
      <h3 className="mb-3">Login</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit}>
        <input className="form-control mb-3" placeholder="Username" value={userName}
          onChange={(e) => setUserName(e.target.value)} required />
        <input type="password" className="form-control mb-3" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn btn-primary w-100" type="submit">Login</button>
      </form>
      <p className="mt-3 mb-0">New here? <a href="/register/">Register</a></p>
    </div>
  );
}
