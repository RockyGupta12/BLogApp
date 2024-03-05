import axios from 'axios';

const baseUrl = 'http://localhost:8001/api/users';

let token = null;
const setToken = (data) => {
    token = `Bearer ${data}`; 
};

const createNewUser = async (userData) => {
  const response = await axios.post( `${baseUrl}/register`, userData);
  return response.data;
};

const getAllUsers = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};
  
const getUser = async () => {
  const config = {
    headers: {
        Authorization:  token
    }
  }
  const response = await axios.get(`${baseUrl}/user-profile`,config);
  return response.data;
};

const updateUser = async (userId, userData) => {
  const response = await axios.put(`${baseUrl}/${userId}`, userData);
  return response.data;
};

const deleteUser = async (userId) => {
  await axios.delete(`${baseUrl}/${userId}`);
};

const followUser = async (userIdToFollow) => {
  const config = {
    headers: {
        Authorization: token
    }
  }

  await axios.post(`${baseUrl}/follow/${userIdToFollow}`,{}, config);
};

const unfollowUser = async (userIdToUnfollow) => {
  const config = {
    headers: {
      Authorization: token,
    },
  };

  await axios.delete(`${baseUrl}/unfollow/${userIdToUnfollow}`,{}, config);
};

const userService = {
  createNewUser,
  setToken,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
};   

export default userService;