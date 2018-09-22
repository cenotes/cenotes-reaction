/* eslint-disable no-undef */

function sendDecryptionRequest(data, cb) {
  return fetch(`/notes/`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: data
  }).then(checkStatus)
    .then(parseJSON)
    .then((r) => cb({}, r))
    .catch(cb);
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
    .catch(cb);
}

function fetchAlgorithmOptions(cb) {
  return fetch("/config/algorithms/")
    .then(checkStatusOk)
    .then(parseJSON)
    .then((r) => cb({}, r))
    .catch(cb);
}

function fetchDefaultAlgorithmOptions(cb) {
  return fetch('/config/algorithms/default')
    .then(checkStatusOk)
    .then(parseJSON)
    .then((r) => cb({}, r))
    .catch(cb);
}


function checkStatusOk(response) {
  if (response.status === 200) {
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  throw error;
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


const Client = { sendDecryptionRequest, sendEncryptRequest,
  fetchAlgorithmOptions, fetchDefaultAlgorithmOptions };
export default Client;
