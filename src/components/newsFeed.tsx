import * as React from "react";
import { RouteComponentProps } from "@reach/router";
import Typography from "@material-ui/core/Typography";
import NavBar from "./common/navBar";
import Post from "./post";

export interface NewsFeedProps extends RouteComponentProps {}

const NewsFeed: React.FC<NewsFeedProps> = () => {
  return (
    <>
      <NavBar />
      <Post />
    </>
  );
};

export default NewsFeed;
