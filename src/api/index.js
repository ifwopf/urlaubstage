import axios from 'axios'

export function authenticate (userData) {
  return axios.post(`http://127.0.0.1:5000/urlaub/api/v1.0/login/`, userData)
}

export function register (userData) {
  return axios.post(`http://127.0.0.1:5000/urlaub/api/v1.0/register/`, userData)
}
