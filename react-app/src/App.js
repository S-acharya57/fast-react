import React, { useState } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import Login from "./components/login.component";
import SignUp from "./components/signup.component";
import MainPage from "./components/mainpage.component";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const user = !!localStorage.getItem("user");
    console.log("Initial isAuthenticated:", user);
    return user;
  });

  const [userName, setUserName] = useState("");

  const handleLogin = (user) => {
    localStorage.setItem("user", "true");
    console.log("Logging in: isAuthenticated = true");
    setIsAuthenticated(true);
    setUserName(`${user.firstName} ${user.lastName}`); // Set full name
  };

  const handleLogout = () => {
    // Remove from localStorage when logging out
    localStorage.removeItem("user");
    console.log("Logging out: isAuthenticated = false");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            {/* Checking if the user is already authenticated or not */}
            <Link
              className="navbar-brand"
              to={isAuthenticated ? "/main-page" : "/sign-in"}
            >
              Project
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                {!isAuthenticated ? (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to={"/sign-in"}>
                        Login
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to={"/sign-up"}>
                        Sign up
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <button
                        className="nav-link btn btn-link"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </>
                )}
              </ul>
              {/* Display user name on the right when authenticated */}
              {isAuthenticated && (
                <span className="navbar-text">
                  Welcome, {userName || "User"}!
                </span>
              )}
            </div>
          </div>
        </nav>
        <Routes>
          <Route
            path="/sign-in"
            element={
              !isAuthenticated ? (
                <div className="auth-wrapper">
                  <div className="auth-inner">
                    <Login onLogin={handleLogin} />
                  </div>
                </div>
              ) : (
                <Navigate to="/main-page" />
              )
            }
          />
          <Route
            path="/sign-up"
            element={
              !isAuthenticated ? (
                <div className="auth-wrapper">
                  <div className="auth-inner">
                    <SignUp onSignUp={handleLogin} />
                  </div>
                </div>
              ) : (
                <Navigate to="/main-page" />
              )
            }
          />
          <Route
            path="/main-page"
            element={
              isAuthenticated ? <MainPage /> : <Navigate to="/sign-in" />
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <div className="full-width-page">
                  <Navigate to="/main-page" />
                </div>
              ) : (
                <Navigate to="/sign-in" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
