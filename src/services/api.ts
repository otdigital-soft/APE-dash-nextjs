// api.js
import Axios from 'axios'

const api = Axios.create({
  baseURL: process.env.API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export const webHuslApi = Axios.create({
  baseURL: process.env.WEBHUSL_API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  params: {
    token: process.env.WEBHUSL_API_MASTER_KEY
  }
})

export default api
