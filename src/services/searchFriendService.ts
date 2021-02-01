import http from "./httpService";
import { getJwt } from "./authService";
import { IUserSearched } from "../interfaces/users";

const apiEndpoint = "/users/search";

export const search = async (searchQuery: string): Promise<IUserSearched[]> => {
  const config = {
    headers: { "x-auth-token": getJwt() },
  };

  const { data } = await http.get(`${apiEndpoint}/${searchQuery}`, config);
  return data;
};
