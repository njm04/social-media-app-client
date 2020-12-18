import React from "react";
import { orderBy } from "lodash";
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
import { IPost } from "../store/posts";

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

  const postCards = () => {
    const sorted = orderBy(posts, ["createdAt"], ["desc"]);
    if (posts.length > 0) {
      return sorted.map((item) => (
        <Box mt={2} bgcolor="background.paper">
          <Card className={classes.root}>
            <CardContent>
              {item.post}
              <TextField
                id="outlined-basic"
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
