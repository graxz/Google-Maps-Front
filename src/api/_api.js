import axios from 'axios'

export default axios.create({
  baseURL: 'https://testenodejspleno.herokuapp.com',
  timeout: 30000
})
