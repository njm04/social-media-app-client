export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((initial) => initial.charAt(0))
    .join("")
    .toUpperCase();
};
