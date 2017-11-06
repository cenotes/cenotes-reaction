/* eslint-disable no-undef */

function search(payload, password, cb) {
  return fetch(`/notes/${payload}/${password}`, {
    accept: "application/json"
  }).then(checkStatus)
    .then(parseJSON)
    .then((r) => cb({}, r))
    .catch(cb)
}

function sendEncryptRequest(data, cb) {
  return fetch("/notes/encrypt/", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: data
  }).then(checkStatus)
    .then(parseJSON)
    .then((r) => cb({}, r))
    .catch(cb)

}


function checkStatus(response) {
  if ([200, 400, 404].indexOf(response.status) !== -1) {
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  throw error;
}

function parseJSON(response) {
  return response.json();
}


const Client = { search, sendEncryptRequest };
export default Client;
