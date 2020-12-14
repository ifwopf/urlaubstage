import axios from 'axios'
import {backendURL} from '@/store'

export function authenticate (userData) {
  return axios.post(backendURL + `/urlaub/api/v1.0/login/`, userData)
}

export function register (userData) {
  return axios.post(backendURL + `/urlaub/api/v1.0/register/`, userData)
}

export function changePassword (userData, token) {
  return axios.post(backendURL + `/urlaub/api/v1.0/changePassword/`, userData, { headers: { Authorization: `Bearer: ` + token }})
}

export function addUnreg (calData, token) {
  return axios.post(backendURL + `/urlaub/api/v1.0/addUnreg/`, calData, { headers: { Authorization: `Bearer: ` + token }})
}

export function deleteUser (token) {
  return axios.post(backendURL + '/urlaub/api/v1.0/deleteUser', null, { headers: { Authorization: `Bearer: ` + token }})
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

export function readyUnreg (data, token) {
  if(data === undefined){
    data = "2020"
  }
  var yearstring = backendURL + '/urlaub/api/v1.0/daysUnreg/' + data
  return axios.get(yearstring,  { headers: { Authorization: `Bearer: ` + token }})
}

export function removeUserFromShared (calID, token) {
  return axios.post(backendURL + `/urlaub/api/v1.0/removeUserFromShared`, calID, {headers: { Authorization: `Bearer: ` + token }})
}

export function getOwners(calID, token) {
  return axios.get(backendURL + '/urlaub/api/v1.0/getOwners/' + calID,  { headers: { Authorization: `Bearer: ` + token }})
}

export function addOwner(payload, token) {
  return axios.post(backendURL + `/urlaub/api/v1.0/addOwner`, payload, {headers: { Authorization: `Bearer: ` + token }})
}

export function deleteOwner(payload, token) {
  return axios.post(backendURL + `/urlaub/api/v1.0/deleteOwner`, payload, {headers: { Authorization: `Bearer: ` + token }})
}

export function checkMail(mail, token) {
  return axios.get(backendURL + '/urlaub/api/v1.0/checkMail/' +  mail, { headers: { Authorization: `Bearer: ` + token } })
}

export function resetCats(days, token) {
  return axios.post(backendURL + '/urlaub/api/v1.0/resetCats', days, { headers: { Authorization: `Bearer: ` + token } })
}
