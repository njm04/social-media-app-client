import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { FaEllipsisH } from "react-icons/fa";
import { getComments, deleteComment } from "../store/comments";
import { IComment } from "../interfaces/comments";
import { getInitials, getDate } from "../utils/utils";
import PostMenu from "./common/postMenu";
import DeleteModal from "./common/deleteModal";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: "inline",
    },
    radius: {
      borderRadius: "5px",
      backgroundColor: "#eceff1",
    },
  })
);

export interface CommentProps {
  postId: string;
}

const Comment: React.FC<CommentProps> = ({ postId }: CommentProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const comments: IComment[] = useSelector(getComments)(postId);
  const [openDeleteCommentModal, setOpenDeleteCommentModal] = useState(false);
  const [commentId, setCommentId] = useState("");

  const handleDeleteComment = (id: string) => {
    dispatch(deleteComment(id));
  };

  return (
    <>
      <List className={classes.root}>
        {comments.map((comment) => {
          return (
            <React.Fragment key={comment._id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>{getInitials(comment.createdBy.firstName)}</Avatar>
                </ListItemAvatar>
                <Grid container spacing={3}>
                  <Grid item xs={11}>
                    <Box px={1} py={1} className={classes.radius}>
                      <ListItemText
                        primary={comment.createdBy.firstName}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              className={classes.inline}
                              color="textPrimary"
                            >
                              {comment.comment}
                            </Typography>
                          </>
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={1}>
                    <PostMenu
                      commentId={comment._id}
                      setCommentId={setCommentId}
                      setOpenDeleteCommentModal={setOpenDeleteCommentModal}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" display="block" gutterBottom>
                      {getDate(comment.createdAt)}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          );
        })}
      </List>
      <DeleteModal
        commentId={commentId}
        openDeleteCommentModal={openDeleteCommentModal}
        setOpenDeleteCommentModal={setOpenDeleteCommentModal}
        handleDeleteComment={handleDeleteComment}
      />
    </>
  );
};

export default Comment;
