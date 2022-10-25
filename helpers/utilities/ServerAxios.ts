import axios from "axios";

const client = axios.create({
    baseURL: process.env.MAIN_API_BASEURL,
});

const ServerAxios = {
    client,
}

// OwnAxios.interceptors.response.use();

export { ServerAxios }