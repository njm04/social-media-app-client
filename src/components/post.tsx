import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import PostField from "./common/postField";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginTop: "80px",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  button: {
    borderRadius: "5px",
  },
  input: {
    display: "none",
  },
});

export interface PostProps {}

const Post: React.FC<PostProps> = () => {
  const classes = useStyles();

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <PostField root={classes.root} />
      </Container>
    </>
  );
};

export default Post;
