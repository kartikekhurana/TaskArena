import axios from 'axios'

const Axios = axios.create({
    baseURL: process.env.API_URL || 'http://localhost:3000/api',
    withCredentials : true,
})

export default Axios;