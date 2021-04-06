import moment from "moment";
import { storage } from "../firebase.config";
import { IPostImages } from "../interfaces/posts";
import { IAuthUser } from "../interfaces/auth";
import { IUser } from "../interfaces/users";

export const getInitials = (name: string) => {
  if (name)
    return name
      .split(" ")
      .map((initial) => initial.charAt(0))
      .join("")
      .toUpperCase();
  return "";
};

export const getProfileName = (data: IAuthUser) => {
  if (data && data.firstName && data.lastName) {
    const firstName = data.firstName
      .split(" ")
      .map((fname) => fname)
      .join("")
      .toLowerCase();

    const lastName = data.lastName
      .split(" ")
      .map((lname) => lname)
      .join("")
      .toLowerCase();

    return `${firstName}.${lastName}`;
  }

  return "";
};

export const getDate = (date: string) => {
  return moment(date).fromNow();
};

export const deleteUploadedImages = (images: IPostImages[]) => {
  const deleteRef = storage.ref();
  if (images && images.length > 0) {
    images.forEach((image: IPostImages) => {
      // Create a reference to the file to delete
      var deleteImage = deleteRef.child(`images/${image.name}`);
      // Delete the file
      deleteImage
        .delete()
        .then(() => console.log(`Image deleted!`))
        .catch(function (error) {
          console.log("Image deletion error: ", error);
        });
    });
  }
};

export const isOnline = (
  status: string = "",
  data: IUser | undefined = undefined
) => {
  if (data && data.status === "active") {
    return false;
  } else if (status === "active") {
    return false;
  }
  return true;
};
