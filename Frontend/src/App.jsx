import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/home";
import BlogForm from "./pages/blogs";
import RegisterForm from "./pages/register";
import UsersForm from "./pages/allusers";
import UserProfile from "./pages/userprofile";
import LoginForm from "./pages/login";
import HomeBlog from "./pages/HomeBLog";
import blogServices from "./services/blog";
import userServices from "./services/user";
import Footer from "./components/footer";
import './Styles/app.css'

const App = () => {
  const [loginUser, setLoginUser] = useState(null);
  const navigate = useNavigate()

  const putUser = (loginUser) => {
    setLoginUser(loginUser);
  };
  useEffect(() => {
    const dataFromLocal = window.localStorage.getItem("loggedBlogUser");
    // console.log(dataFromLocal)
    if (dataFromLocal) {
      const gotUser = JSON.parse(dataFromLocal);
      blogServices.setToken(gotUser.token);
      userServices.setToken(gotUser.token);
      setLoginUser(gotUser);
    }
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
        setLoginUser(null);
        blogServices.setToken(null);
        window.localStorage.removeItem("loggedBlogUser");
        navigate('/');
    }
};

  return (
    <div>
      <div>
        {loginUser ? (
          <>
             <Link style={{ padding: 10}} to="/homeblog">Home</Link>
            <em>
              {loginUser.username} logged in{" "}
              <button onClick={handleLogout}>Log out</button>
            </em>
            <Link style={{ padding: 10 }} to="/userprofile">Profile</Link>
            <Link style={{ padding: 10 }} to="/users">Users</Link>
          </>
        ) : (
          <>
            <Link style={{ padding: 10 }} to="/">Home</Link>
            <Link style={{ padding: 10 }} to="/register">Register</Link>
            <Link style={{ padding: 10 }} to="/login">Login</Link>
          </>
        )}
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/homeblog" element={<HomeBlog />} />
        <Route path="/blogs" element={<BlogForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/users" element={<UsersForm />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/login" element={<LoginForm putUser={putUser} />} />
      </Routes>
      <Footer />
     </div>
  );
};

export default App;
