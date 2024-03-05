import axios from "axios"
const baseUrl = 'http://localhost:8001/api/blogs'

let token = null;
const setToken = data=>{
    token=`Bearer ${data} `
}

const create=async(data)=>{
    const config = {
        headers: {
            Authorization: token
        }
    }
    const response= await axios.post(baseUrl,data,config)
    return response.data
}

const getAll = async () => {
  const config = {
    headers: {
        Authorization: token
    }
}
  const response = await axios.get(baseUrl,config);
  return response.data;
};


const like = async (blogId, userId) => {
  const config = {
    headers: {
      Authorization: token,
    },
  };

  const response = await axios.post(`${baseUrl}/like/${blogId}`, { userId }, config);
  return response.data;
};

const dislike = async (blogId, userId) => {
  const config = {
    headers: {
      Authorization: token,
    },
  };

  const response = await axios.post(`${baseUrl}/dislike/${blogId}`, { userId }, config);
  return response.data;
};
const update = async (id, data) => {
  const config = {
    headers: {
      Authorization: token,
    },
  };

  const response = await axios.put(`${baseUrl}/${id}`, data, config);
  return response.data;
};
const remove = async (id) => {
  const config = {
      headers: { 
        Authorization: token
       }
  }

  try {
      const response = await axios.delete(`${baseUrl}/${id}`, config)
      return response.data
  } catch (error) {
      console.error('Error deleting blog:', error)
  }
}
const blogService = {
  create,setToken,getAll,like,dislike,update,remove
};   

export default blogService;