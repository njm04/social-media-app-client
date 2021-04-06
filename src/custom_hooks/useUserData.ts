import { useState, useEffect } from "react";
import { IAuthUser } from "../interfaces/auth";

enum Kind {
  id = "id",
  fullName = "fullName",
}

export const useUserData = (user: IAuthUser | null, kind: string): string => {
  const [userData, setUserData] = useState("");
  useEffect((): void => {
    if (kind === Kind.id) {
      if (user && user._id) setUserData(user._id);
      else setUserData("");
    } else if (kind === Kind.fullName) {
      if (user && user.fullName) setUserData(user.fullName);
      else setUserData("");
    }
  }, [kind, user]);

  return userData;
};
