import { IProfPic } from "../interfaces/profPic";

export interface IAuthUser {
  _id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  profilePicture?: IProfPic;
  exp?: number;
  iat?: number;
}
