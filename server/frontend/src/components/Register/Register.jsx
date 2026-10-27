import React, { useState } from "react";

export default function Register() {
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const register = async (e) => {
    e.preventDefault();
    const res = await fetch("/djangoapp/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, password, firstName, lastName, email }),
    });
    const json = await res.json();
    if (json.status === "Authenticated") {
      sessionStorage.setItem("username", json.userName);
      window.location.href = "/";
    } else if (json.error) {
      setError("The user with the same username is already registered.");
    }
  };

  return (
    <div className="card-box mx-auto" style={{ maxWidth: 460 }}>
      <h3 className="mb-3">Sign Up</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={register}>
        <input className="form-control mb-3" placeholder="Username" value={userName}
          onChange={(e) => setUserName(e.target.value)} required />
        <input className="form-control mb-3" placeholder="First Name" value={firstName}
          onChange={(e) => setFirstName(e.target.value)} required />
        <input className="form-control mb-3" placeholder="Last Name" value={lastName}
          onChange={(e) => setLastName(e.target.value)} required />
        <input type="email" className="form-control mb-3" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" className="form-control mb-3" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn btn-success w-100" type="submit">Register</button>
      </form>
    </div>
  );
}
