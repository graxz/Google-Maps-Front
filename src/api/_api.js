import axios from 'axios'

export default axios.create({
  baseURL: 'https://gmaps-api.onrender.com',
  timeout: 30000
})
