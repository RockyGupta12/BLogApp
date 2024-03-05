import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import userServices from "../services/user";
import Notification from "../components/notification";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate()
  const handleCreateUser = async (event) => {
    event.preventDefault();
    try {
      const user = await userServices.createNewUser({
        username,
        name,
        password,
      });
      console.log(user);
      setUsers([...users, user]);
      setUsername("");
      setName("");
      setPassword("");
      navigate('/login')
      window.alert("User created successfully.");
    } catch (error) {
      console.error("Error creating user:", error.message);
      setErrorMessage("Failed to create user.",error.message);
      setTimeout(() => {
        setErrorMessage(null);
      }, 4000);
    }
  };
  // Define your styles
  const registerFormStyle = {
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
    <div style={registerFormStyle}>
      <h1>Register Form</h1>
      <Notification message={errorMessage} />
      <form onSubmit={handleCreateUser}>
        <label>Username</label>
        <input
          type="text"
          value={username}
          style={inputStyle}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <label>Name</label>
        <input
          type="text"
          value={name}
          style={inputStyle}
          onChange={(e) => setName(e.target.value)}
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
          Create User
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
