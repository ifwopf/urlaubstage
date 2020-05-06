import axios from 'axios'
import {backendURL} from '@/store'

export function authenticate (userData) {
  return axios.post(backendURL + `/urlaub/api/v1.0/login/`, userData)
}

export function register (userData) {
  return axios.post(backendURL + `/urlaub/api/v1.0/register/`, userData)
}

export function getCalName (calID, token) {
  return axios.get(backendURL + '/urlaub/api/v1.0/getCalName/' + calID,  { headers: { Authorization: `Bearer: ` + token }})
}

export function getUserRole (calID, token) {
  return axios.get(backendURL + '/urlaub/api/v1.0/getUserRole/' + calID,  { headers: { Authorization: `Bearer: ` + token }})
}

export function getFeiertage(token) {
  return axios.get(backendURL + '/urlaub/api/v1.0/getFeiertage',  { headers: { Authorization: `Bearer: ` + token }})
}

export function getSharedInfo(calID, token) {
  return axios.get(backendURL + '/urlaub/api/v1.0/getSharedInfo/' + calID,  { headers: { Authorization: `Bearer: ` + token }})
}

export function saveSharedChanges(payload, token) {
  return axios.post(backendURL + `/urlaub/api/v1.0/editShared`, payload, {headers: { Authorization: `Bearer: ` + token }})
}

export function saveCalName(payload, token) {
  return axios.post(backendURL + `/urlaub/api/v1.0/saveCalName`, payload, {headers: { Authorization: `Bearer: ` + token }})
}
