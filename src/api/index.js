import axios from 'axios'
const backendURL = "http://127.0.0.1:5000"
//const backendURL = "https://urlaubskalender.herokuapp.com"

export function authenticate (userData) {
  return axios.post(backendURL + `/urlaub/api/v1.0/login/`, userData)
}

export function register (userData) {
  return axios.post(backendURL + `/urlaub/api/v1.0/register/`, userData)
}

export function getCalName (calID, token) {
  return axios.get(backendURL + '/urlaub/api/v1.0/getCalName/' + calID,  { headers: { Authorization: `Bearer: ` + token }})
}
