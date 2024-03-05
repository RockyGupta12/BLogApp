import { useEffect, useState } from "react";
import loginServices from "../services/login";
import blogServices from "../services/blog";
import userServices from "../services/user";
import { useNavigate } from "react-router-dom";

import Notification from "../components/notification";

const LoginForm = ({ putUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const loginedUser = await loginServices.login({ username, password });
      console.log(loginedUser);
      putUser(loginedUser);
      console.log(loginedUser.token)
      blogServices.setToken(loginedUser.token);
      userServices.setToken(loginedUser.token)
      window.localStorage.setItem(
        "loggedBlogUser",
        JSON.stringify(loginedUser)
      );
      setUsername("");
      setPassword("");
      navigate('/homeblog')
    } catch (error) {
      setErrorMessage("Wrong Credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 4000);
    }
  };

  // Define your styles
  const loginFormStyle = {
    width: "300px",
    margin: "auto",
    padding: "20px",
    backgroundColor: "#f4f4f4",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    margin: "8px 0",
    boxSizing: "border-box",
  };
  const buttonStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  return (
    <div style={loginFormStyle}>
      <h1>Login</h1>
      <Notification message={errorMessage} />
      <form onSubmit={handleLogin}>
        <label>Username</label>
        <input
          type="text"
          value={username}
          style={inputStyle}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <label>Password</label>
        <input
          type="password"
          value={password}
          style={inputStyle}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit" style={buttonStyle}>
          Login
        </button>
      </form>
    </div>
  );
};
export default LoginForm;
