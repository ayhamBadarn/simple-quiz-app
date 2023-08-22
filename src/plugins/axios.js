import axios from "axios";


axios.defaults.baseURL = `http://localhost:7000`

export const authHeader = (token) => ({
  Authorization: `Bearer ${token}`
})

export default axios