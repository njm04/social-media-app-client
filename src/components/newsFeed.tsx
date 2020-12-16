import * as React from "react";
import { RouteComponentProps } from "@reach/router";
import Typography from "@material-ui/core/Typography";
import NavBar from "./common/navBar";

export interface NewsFeedProps extends RouteComponentProps {}

const NewsFeed: React.FC<NewsFeedProps> = () => {
  return (
    <>
      <NavBar />
      <Typography component="h1" variant="h5">
        Hello World
      </Typography>
    </>
  );
};

export default NewsFeed;
