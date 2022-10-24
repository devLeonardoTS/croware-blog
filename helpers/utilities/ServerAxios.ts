import axios from "axios";

const client = axios.create({
    baseURL: process.env.MAIN_API_BASEURL,
    validateStatus: (status) => true,
});

const ServerAxios = {
    client,
}

// OwnAxios.interceptors.response.use();

export { ServerAxios }