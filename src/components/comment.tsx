import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { orderBy } from "lodash";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import {
  getComments,
  deleteComment,
  getSingleComment,
  editComment,
} from "../store/comments";
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
  userId: string;
}

const Comment: React.FC<CommentProps> = ({ postId, userId }: CommentProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const comments: IComment[] = useSelector(getComments)(postId);
  const sorted = orderBy(comments, ["createdAt"], ["desc"]);
  const [openDeleteCommentModal, setOpenDeleteCommentModal] = useState(false);
  const [commentId, setCommentId] = useState("");
  const [editCommentId, setEditCommentId] = useState("");
  const userComment = useSelector(getSingleComment)(editCommentId);
  const [editUserComment, setEditUserComment] = useState("");

  useEffect((): any => {
    if (userComment) setEditUserComment(userComment.comment);
  }, [userComment]);

  const handleEditComment = (
    e: React.KeyboardEvent<HTMLDivElement>,
    commentId: string
  ) => {
    if (e.key === "Enter" && editUserComment !== "") {
      dispatch(
        editComment({ id: editCommentId, updatedComment: editUserComment })
      );
      setEditUserComment("");
      setEditCommentId("");
    }
  };

  const handleDeleteComment = (id: string) => {
    dispatch(deleteComment(id));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditUserComment(e.target.value);
  };

  return (
    <>
      <List className={classes.root}>
        {sorted.map((comment) => {
          return (
            <React.Fragment key={comment._id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>{getInitials(comment.createdBy.fullName)}</Avatar>
                </ListItemAvatar>
                <Grid container spacing={3}>
                  <Grid item xs={11}>
                    <Box px={1} py={1} className={classes.radius}>
                      {userComment ? (
                        <>
                          <Grid item xs={12}>
                            <Typography>
                              {comment.createdBy.firstName}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              id="standard-basic"
                              variant="outlined"
                              fullWidth
                              onChange={handleChange}
                              onKeyDown={(e) =>
                                handleEditComment(e, comment._id)
                              }
                              value={editUserComment}
                            />
                          </Grid>
                        </>
                      ) : (
                        <ListItemText
                          primary={comment.createdBy.firstName}
                          secondary={
                            <Typography
                              component="span"
                              variant="body2"
                              className={classes.inline}
                              color="textPrimary"
                            >
                              {comment.comment}
                            </Typography>
                          }
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={1}>
                    {userId === comment.createdBy._id ? (
                      <PostMenu
                        commentId={comment._id}
                        setCommentId={setCommentId}
                        setEditCommentId={setEditCommentId}
                        setOpenDeleteCommentModal={setOpenDeleteCommentModal}
                      />
                    ) : null}
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
        open={openDeleteCommentModal}
        setOpenDeleteCommentModal={setOpenDeleteCommentModal}
        handleDeleteComment={handleDeleteComment}
      />
    </>
  );
};

export default Comment;
