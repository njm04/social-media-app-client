import React from "react";
import { orderBy } from "lodash";
import moment from "moment";
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
import { getInitials } from "./../utils/utils";
import { IPost } from "../store/posts";

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
  })
);

export interface PostCardProps {
  posts: IPost[];
}

const PostCard: React.FC<PostCardProps> = ({ posts }: PostCardProps) => {
  const classes = useStyles();
  const onKeyEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      console.log("entered");
    }
  };

  const getPostDate = (date: string) => {
    return moment(date).format("MMMM Do YYYY, h:mm a");
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
                    <Typography>{item.post}</Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" display="block" gutterBottom>
                    {getPostDate(item.createdAt)}
                  </Typography>
                </Grid>
              </Paper>
              <TextField
                id={item._id}
                variant="outlined"
                fullWidth
                size="small"
                placeholder="Write a comment..."
                onKeyDown={onKeyEnter}
              />
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
