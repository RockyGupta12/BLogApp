import React, { useState, useEffect } from "react";
import userServices from "../services/user";
import Notification from "../components/notification";

const UsersForm = () => {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const refreshUsers = async () => {
    try {
      const fetchedUsers = await userServices.getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error.message);
      setErrorMessage("Failed to fetch users.");
    }
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const handleToggleFollow = async (userId) => {
    try {
      const dataFromLocal = window.localStorage.getItem("loggedBlogUser");
      // console.log(dataFromLocal)
      if (dataFromLocal) {
        const gotUser = JSON.parse(dataFromLocal);
        userServices.setToken(gotUser.token);
      }
      // Find the user in the users array
      const userToUpdate = users.find(user => user.id === userId);

      if (!userToUpdate) {
        console.error("User not found for toggle follow/unfollow");
        return;
      }

      if (userToUpdate.isFollowing) {
        await userServices.unfollowUser(userId);
      } else {
        await userServices.followUser(userId);
      }

      // Refresh users after follow/unfollow
      refreshUsers();
    } catch (error) {
      console.error("Error toggling follow:", error.message);
      // Handle error
    }
  };

  return (
    <div>
      <Notification message={errorMessage} />
      {/* Display the list of users */}
      <h2>All Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.username}
            {user.isFollowing ? (
              <button onClick={() => handleToggleFollow(user.id)}>Unfollow</button>
            ) : (
              <button onClick={() => handleToggleFollow(user.id)}>Follow</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersForm;
