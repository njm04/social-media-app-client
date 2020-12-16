import jwtDecode from "jwt-decode";
import http from "./httpService";
import { authReceived } from "../store/auth";

const apiEndpoint = "/auth";
const tokenKey = "token";

http.setJwt(getJwt());

export const login = async (email: string, password: string) => {
  const { data: jwt } = await http.post(apiEndpoint, { email, password });
  localStorage.setItem(tokenKey, jwt);
};

export const loginWithJwt = (jwt: string) => {
  localStorage.setItem(tokenKey, jwt);
};

export const logout = () => {
  localStorage.removeItem(tokenKey);
  http.setJwt(false);
};

export const getCurrentUser = (): object => {
  try {
    const jwt = localStorage.getItem(tokenKey);
    if (typeof jwt === "string") return jwtDecode(jwt);
    return {};
  } catch (error) {
    return {};
  }
};

// used to set user current user data everytime page refresh if user is already authenticated
export const setCurrentUser = (store: any) => {
  if (localStorage.token) store.dispatch(authReceived(getCurrentUser()));
};

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

const auth = {
  login,
  loginWithJwt,
  logout,
  getCurrentUser,
  getJwt,
  setCurrentUser,
};

export default auth;
