import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = process.env.REACT_APP_MASSAGE_BOOKING_API_URL;
const tokenKey = "token";

axios.interceptors.response.use(
  (config) => {
    const token = localStorage.getItem(tokenKey);
    if (token !== null) config.headers["x-auth-token"] = token;
    return config;
  },
  (error) => {
    const expectedError =
      error.response && error.response >= 400 && error.response < 500;

    if (!expectedError) {
      toast.error(error.response.data);
    }

    return Promise.reject(error);
  }
);

export const setJwt = (jwt: string | boolean | null) =>
  (axios.defaults.headers.common["x-auth-token"] = jwt);

const httpService = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt,
};

export default httpService;
