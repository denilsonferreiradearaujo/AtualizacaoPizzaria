import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://localhost:3333'
    baseURL: 'http://10.0.3.254:3333'
})

export {api};