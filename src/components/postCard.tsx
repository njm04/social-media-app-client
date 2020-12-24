import React, { useState } from "react";
import { orderBy } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { getInitials } from "./../utils/utils";
import { IPost, postCommentIncremented } from "../store/posts";
import {
  loadComments,
  createComment,
  didCommentFailed,
} from "../store/comments";
import { getUser, IAuthUser } from "../store/auth";
import { getDate } from "../utils/utils";
import Comment from "./comment";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: 275,
      flexGrow: 1,
      overflow: "hidden",
      padding: theme.spacing(0, 3),
    },
    paper: {
      // maxWidth: 400,
      margin: `${theme.spacing(1)}px auto`,
      padding: theme.spacing(2),
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
    postContent: {
      textAlign: "left",
    },
    commentsCount: {
      borderBottom: "1px solid",
    },
  })
);

export interface PostCardProps {
  posts: IPost[];
}

const PostCard: React.FC<PostCardProps> = ({ posts }: PostCardProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user: IAuthUser | null = useSelector(getUser);
  const isFailed = useSelector(didCommentFailed);
  const [show, setShow] = useState(false);
  const [id, setId] = useState("");
  const [comment, setComment] = useState("");

  const onKeyEnter = (e: React.KeyboardEvent<HTMLDivElement>, post: string) => {
    const userId = user && user._id;
    if (e.key === "Enter" && comment !== "") {
      dispatch(createComment({ userId, post, comment }));
      if (!isFailed) dispatch(postCommentIncremented({ post }));
      setComment("");
    }
  };

  const onClickShowComments = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    postId: string
  ) => {
    e.preventDefault();
    setShow(true);
    setId(postId);
    dispatch(loadComments(postId));
  };

  const handleComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const getCommentsCount = (count: number) => {
    const commentsCount =
      count === 1 ? `${count} Comment` : count > 1 ? `${count} Comments` : "";
    return <Typography align="right">{commentsCount}</Typography>;
  };

  const postCards = () => {
    const sorted = orderBy(posts, ["createdAt"], ["desc"]);

    if (posts.length > 0) {
      return sorted.map((item) => (
        <Box mt={2} bgcolor="background.paper" key={item._id}>
          <Card className={classes.root}>
            <CardContent className={classes.postContent}>
              <Paper className={classes.paper}>
                <Grid container wrap="nowrap" spacing={2}>
                  <Grid item>
                    <Avatar>{getInitials(item.postedBy.firstName)}</Avatar>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>{item.postedBy.fullName}</Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Box px={7} py={2}>
                    <Typography>{item.post}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" display="block" gutterBottom>
                    {getDate(item.createdAt)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  {getCommentsCount(item.commentCount)}
                  <Divider variant="fullWidth" component="hr" />
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button color="primary" fullWidth>
                      Like
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      color="primary"
                      fullWidth
                      onClick={(e) => onClickShowComments(e, item._id)}
                    >
                      Comment
                    </Button>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  {/* does item._id === id have another alternative way?*/}
                  {show && item._id === id && (
                    <>
                      <TextField
                        id={item._id}
                        value={comment}
                        variant="outlined"
                        fullWidth
                        size="small"
                        placeholder="Write a comment..."
                        onKeyDown={(e) => onKeyEnter(e, item._id)}
                        onChange={handleComment}
                      />
                      <Comment postId={item._id} key={item._id} />
                    </>
                  )}
                </Grid>
              </Paper>
            </CardContent>
          </Card>
        </Box>
      ));
    }
    return "";
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">{postCards()}</Container>
    </>
  );
};

export default PostCard;
