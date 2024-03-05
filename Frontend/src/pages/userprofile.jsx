import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import userServices from '../services/user';
import Notification from "../components/notification";
import "../Styles/userprofile.css"; // Assuming you have a CSS file for styling
import OurImage from '../assets/img1.jpg'
const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate=useNavigate()
    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        try {
            const fetchedUser = await userServices.getUser();
            setUser(fetchedUser);
        } catch (error) {
            console.error("Error fetching user:", error.message);
            setErrorMessage("Failed to fetch user.");
        }
    };

    const handleUpdateUser = async () => {
        try {
            const updatedUser = await userServices.updateUser(user.id, {
                name,
                username,
            });
            setUser(updatedUser);
            setIsEditing(false); // Exit editing mode after update
            setUsername("")
            setName("")
        } catch (error) {
            console.error("Error updating user:", error.message);
            setErrorMessage("Failed to update user.");
        }
    };

    const handleDeleteUser = async () => {
        try {
            await userServices.deleteUser(user.id);
            const confirmDelete = window.confirm("Are you sure you want to delete account?");
            if (confirmDelete) {
                setUser(null);
                setErrorMessage(null);
                navigate('/')
            }
           
        } catch (error) {
            console.error("Error deleting user:", error.message);
            setErrorMessage("Failed to delete user.");
        }
    };


    return (
        <div className="user-profile">
        <Notification message={errorMessage} />
        {user ? (
            <div>
                <h2>User Profile</h2>
                <img src={OurImage} alt="User" className="user-picture rounded" />
                <p>Name: {user.name}</p>
                <p>Username: {user.username}</p>
                {!isEditing && ( // Render only when not in editing mode
                    <div>
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                        <button onClick={handleDeleteUser}>Delete</button>
                    </div>
                )}
                {isEditing && (
                    <div>
                        <input
                            type="text"
                            value={name}
                            placeholder="Name"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="text"
                            value={username}
                            placeholder="Username"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <button onClick={handleUpdateUser}>Update</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                )}
            </div>
        ) : (
            <p>Loading user profile...</p>
        )}
    </div>
    );
};

export default UserProfile;