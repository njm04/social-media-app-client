import moment from "moment";

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
