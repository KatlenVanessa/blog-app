import axios from 'axios';

const client = axios.create({ baseURL: "http://192.168.1.2:4848/api" });

export default client;