import React from "react";

export default function Header() {
  const username = sessionStorage.getItem("username");
  const path = window.location.pathname;

  const logout = async () => {
    await fetch("/djangoapp/logout");
    sessionStorage.removeItem("username");
    window.location.href = "/";
  };

  const link = (href, label, active) => (
    <li className="nav-item">
      <a className={"nav-link" + (active ? " active fw-bold" : "")} href={href}>{label}</a>
    </li>
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand" href="/">Cars Dealership</a>
        <ul className="navbar-nav me-auto">
          {link("/", "Home", path === "/" || path.startsWith("/dealer"))}
          {link("/about/", "About Us", false)}
          {link("/contact/", "Contact Us", false)}
        </ul>
        <ul className="navbar-nav ms-auto align-items-center">
          {username ? (
            <>
              <li className="nav-item"><span className="navbar-text text-white me-3">{username}</span></li>
              <li className="nav-item"><button className="btn btn-outline-light btn-sm" onClick={logout}>Logout</button></li>
            </>
          ) : (
            <>
              {link("/login/", "Login", path === "/login/")}
              {link("/register/", "Register", path === "/register/")}
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
