import axios from 'axios';

const API = axios.create({
  baseURL: `/api/`,
  timeout: 5000,
});

export {
	createContract,
}

function createContract(states, cb){
	API.post('contract', states)
		.then((res) => cb(null, res.data), err => cb(err));
}