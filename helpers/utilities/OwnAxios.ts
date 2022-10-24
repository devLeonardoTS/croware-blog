import axios from "axios";
import { CS_MAIN_API_BASEURL } from "../constants/getEnvVars";

const client = axios.create({
    baseURL: CS_MAIN_API_BASEURL || process.env.NEXT_PUBLIC_MAIN_API_BASE_URL,
    validateStatus: (status) => true,
});

const setAuthHeader = (token?: string) => {
    if (token) {
        client.defaults.headers.common.authorization = `Bearer ${token}`;
    } else {
        delete client.defaults.headers.common.authorization;
    }
}

const OwnAxios = {
    client,
    setAuthHeader
}

// OwnAxios.interceptors.response.use();

export { OwnAxios }