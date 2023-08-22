import axios from "axios";


axios.defaults.baseURL = `https://simple-quiz-server.onrender.com/`

export const authHeader = (token) => ({
  Authorization: `Bearer ${token}`
})

export default axios
