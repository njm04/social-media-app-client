import React, { useState } from "react";
import { useDispatch } from "react-redux";
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
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import PhotoIcon from "@material-ui/icons/Photo";
import { storage } from "../firebase.config";
import { updateUserProfPic, IProfPic } from "../store/users";

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
    avatar: {
      width: 180,
      height: 180,
    },
    input: {
      display: "none",
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

export interface EditProfileModalProps {
  open: boolean;
  userId: string;
  profImage: IProfPic;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

type ImageData = {
  name: string;
  url: string;
};

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  userId,
  profImage,
  setOpenModal,
}: EditProfileModalProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [profilePicture, setProfilePicture] = useState<IProfPic>();
  const [imageData, setImageData] = useState<object[]>();

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageInfo: object[] = [];
    if (e.target.files !== null) {
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const data: ImageData = await uploadImage(file);
        setProfilePicture(data);
        dispatch(updateUserProfPic(userId, data));
        imageInfo.push(data);
      }
    }
    setImageData(imageInfo);
  };

  const uploadImage = (
    imageFile: Blob | Uint8Array | ArrayBuffer
  ): Promise<ImageData> => {
    return new Promise((resolve, reject) => {
      let currentImageName = `firebase-image-user-avatar-${Date.now()}-${userId}`;
      let uploadImage = storage
        .ref(`images/${currentImageName}`)
        .put(imageFile);

      uploadImage.on(
        "state_changed",
        (snapshot) => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => reject(error),
        () => {
          storage
            .ref("images")
            .child(currentImageName)
            .getDownloadURL()
            .then((url) => {
              resolve({
                name: currentImageName,
                url,
              });
            });
        }
      );
    });
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
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid container wrap="nowrap" spacing={2}>
                <Grid item container justify="flex-start" xs={6}>
                  <Typography variant="h5">Profile Picture</Typography>
                </Grid>
                <Grid item container justify="flex-end" xs={6}>
                  <input
                    accept="image/*"
                    className={classes.input}
                    id="contained-button-file"
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="contained-button-file">
                    <Button
                      // variant="contained"
                      color="primary"
                      component="span"
                      size="small"
                      startIcon={<PhotoIcon />}
                    >
                      Photo
                    </Button>
                  </label>
                </Grid>
              </Grid>
              <Box
                bgcolor="secondary.main"
                display="flex"
                style={{
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <Avatar
                  className={classes.avatar}
                  alt={profImage.name}
                  src={profImage.url}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus color="primary">
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditProfileModal;
