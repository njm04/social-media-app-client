import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import NavBar from "./common/navBar";
import { loadUsers } from "../store/users";

export interface RootProps {
  children: React.ReactNode;
}

const Root: React.FC<RootProps> = ({ children }: RootProps) => {
  const dispatch = useDispatch();

  useEffect((): any => dispatch(loadUsers()));
  return (
    <>
      <NavBar />
      {children}
    </>
  );
};

export default Root;
