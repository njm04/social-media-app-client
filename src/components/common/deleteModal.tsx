import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

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
  });

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

export interface DeleteModalProps {
  postId?: string;
  commentId?: string;
  open: boolean;
  setOpenDeletePostModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDeleteCommentModal?: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteComment?(commentId: string): void;
  handleDeletePost?(postId: string): void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  postId,
  commentId,
  open,
  setOpenDeleteCommentModal,
  handleDeleteComment,
  setOpenDeletePostModal,
  handleDeletePost,
}: DeleteModalProps) => {
  const handleClose = () => {
    if (setOpenDeleteCommentModal) setOpenDeleteCommentModal(false);
    if (setOpenDeletePostModal) setOpenDeletePostModal(false);
  };

  const handleDelete = () => {
    if (handleDeleteComment && setOpenDeleteCommentModal && commentId) {
      handleDeleteComment(commentId);
      setOpenDeleteCommentModal(false);
    }

    if (handleDeletePost && setOpenDeletePostModal && postId) {
      handleDeletePost(postId);
      setOpenDeletePostModal(false);
    }
  };

  const dialog = () => {
    if (commentId)
      return {
        title: "Delete comment",
        content: "Are you sure you want to delete this comment?",
      };

    if (postId)
      return {
        title: "Delete post",
        content: "Are you sure you want to delete this post?",
      };

    return { title: "", content: "" };
  };

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {dialog().title}
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>{dialog().content}</Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="default">
            Cancel
          </Button>
          <Button autoFocus color="primary" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteModal;
