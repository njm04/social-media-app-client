import moment from "moment";
import { storage } from "../firebase.config";
import { IPostImages } from "../store/posts";

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((initial) => initial.charAt(0))
    .join("")
    .toUpperCase();
};

export const getDate = (date: string) => {
  return moment(date).fromNow();
};

export const deleteUploadedImages = (images: IPostImages[]) => {
  const deleteRef = storage.ref();
  if (images.length > 0) {
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
