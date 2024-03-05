//Axios is a popular JavaScript library used for making HTTP requests, and it is often employed in React applications for handling data fetching and communication with APIs (Application Programming Interfaces). It provides a simple and consistent interface for making asynchronous requests to servers.
import axios from "axios"
//const baseUrl= '/api/login'

const login=async (Credentials)=>{
    const response= await axios.post('http://localhost:8001/api/users/login',Credentials)
   // const resposne = await axios.post(baseUrl,Credential)
    return response.data
}

export default {login}
