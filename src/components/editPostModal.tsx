import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
  makeStyles,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import { getPost, IPostImages, editPost, IPost } from "../store/posts";
import ImageUploadGrid from "./imageUploadGrid";
import { getInitials, getDate } from "../utils/utils";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    grid: {
      minWidth: 275,
      flexGrow: 1,
      overflow: "hidden",
      padding: theme.spacing(0, 3),
    },
  });

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
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
    postContent: {
      textAlign: "left",
    },
  })
);

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export interface EditPostModalProps {
  open: boolean;
  postId: string;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditPostModal: React.FC<EditPostModalProps> = ({
  open,
  postId,
  setOpenModal,
}: EditPostModalProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const post = useSelector(getPost)(postId);
  let postCaption: string = "";
  if (post) postCaption = post.post;
  const [postContent, setPostContent] = useState(postCaption);

  const handleClose = () => {
    setOpenModal(false);
    setPostContent(postCaption);
  };

  const handleEdit = () => {
    if (post) dispatch(editPost({ id: post._id, newPost: postContent }));
    setOpenModal(false);
  };

  useEffect((): any => {
    if (post) setPostContent(post.post);
  }, [post]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostContent(e.target.value);
  };

  const displayPostImage = (postImages: IPostImages[]) => {
    if (postImages && postImages.length > 0) {
      if (postImages.length === 1) {
        return <ImageUploadGrid images={postImages} cols={1} />;
      } else if (postImages.length === 2) {
        return <ImageUploadGrid images={postImages} cols={2} />;
      } else {
        return <ImageUploadGrid images={postImages} cols={2} />;
      }
    }

    return;
  };

  const dialogContent = () => {
    if (post) {
      return (
        <Paper className={classes.paper}>
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              <Avatar>{getInitials(post.postedBy.firstName)}</Avatar>
            </Grid>
            <Grid item xs={12}>
              <Typography>{post.postedBy.fullName}</Typography>
              <Typography variant="caption" display="block" gutterBottom>
                {getDate(post.createdAt)}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Box px={7} py={2}>
              <form noValidate autoComplete="off">
                <TextField
                  id="standard-basic"
                  InputProps={{ disableUnderline: true }}
                  multiline
                  fullWidth
                  value={postContent}
                  onChange={handleChange}
                />
              </form>
              {displayPostImage(post.postImages)}
            </Box>
          </Grid>
        </Paper>
      );
    }
  };

  return (
    <div>
      <Dialog
        // onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Edit Post
        </DialogTitle>
        <DialogContent dividers>{dialogContent()}</DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleEdit} color="primary">
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditPostModal;
