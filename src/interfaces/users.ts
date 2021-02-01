import { IProfPic } from "./profPic";

export interface IUser {
  addressTwo: string;
  status: string;
  friends: string[];
  isDeleted: false;
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  birthDate: string;
  gender: string;
  contactNumber: string;
  address: string;
  state: string;
  city: string;
  zip: string;
  createdAt: string;
  updatedAt: string;
  profilePicture: IProfPic;
  coverPhoto: IProfPic;
}

export interface IUserSearched {
  _id: string;
  fullName: string;
  profilePicture: IProfPic;
}
