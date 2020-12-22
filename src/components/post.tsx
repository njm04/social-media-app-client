import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import { createPost } from "../store/posts";
import { getUser, IAuthUser } from "../store/auth";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
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
});

export interface PostProps {}

const Post: React.FC<PostProps> = () => {
  const dispatch = useDispatch();
  const user: IAuthUser | null = useSelector(getUser);
  const classes = useStyles();
  const [post, setPost] = useState("");

  const handleChangePost = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPost(e.target.value);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const postedBy: string = user && user._id ? user._id : "";
    dispatch(createPost({ postedBy, post }));
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <Box mt={2} bgcolor="background.paper">
          <Card className={classes.root}>
            <CardContent>
              <TextField
                id="outlined-basic"
                multiline
                variant="outlined"
                placeholder="What's on your mind?"
                fullWidth
                onChange={handleChangePost}
              />
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                className={classes.button}
                size="small"
                onClick={(e) => handleSubmit(e)}
              >
                Post
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Container>
    </>
  );
};

export default Post;