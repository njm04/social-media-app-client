import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import PhotoIcon from "@material-ui/icons/Photo";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { createPost } from "../store/posts";
import { getUser, IAuthUser } from "../store/auth";
import { IImageData } from "../store/images";
import { storage } from "../firebase.config";
import ImageUploadGrid from "./imageUploadGrid";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginTop: "15vh",
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

type ImageData = {
  name: string;
  url: string;
};

const Post: React.FC<PostProps> = () => {
  const dispatch = useDispatch();
  const user: IAuthUser | null = useSelector(getUser);
  const classes = useStyles();
  const [post, setPost] = useState("");
  const [images, setImages] = useState<IImageData[]>();
  const [imageData, setImageData] = useState<object[]>();

  const handleChangePost = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPost(e.target.value);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const postedBy: string = user && user._id ? user._id : "";
    if (post !== "") {
      dispatch(createPost({ postedBy, post, imageData }));
      setPost("");
      setImages([]);
      setImageData([]);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let imageUrls: IImageData[] = [];
    const imageInfo: object[] = [];
    if (e.target.files !== null) {
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const data: ImageData = await uploadImage(file);
        imageUrls.push(data);
        imageInfo.push(data);
      }
    }
    setImages(imageUrls);
    setImageData(imageInfo);
  };

  const uploadImage = (
    imageFile: Blob | Uint8Array | ArrayBuffer
  ): Promise<ImageData> => {
    return new Promise((resolve, reject) => {
      const userId: string = user && user._id ? user._id : "";
      let currentImageName = `firebase-image-${Date.now()}-${userId}`;
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

  const imageUploadView = () => {
    if (images && images.length > 0) {
      if (images.length === 1) {
        return <ImageUploadGrid images={images} cols={1} />;
      } else if (images.length === 2) {
        return <ImageUploadGrid images={images} cols={2} />;
      } else {
        return <ImageUploadGrid images={images} />;
      }
    }

    return;
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
                value={post}
              />
              {imageUploadView()}
            </CardContent>
            <CardActions>
              <Grid container wrap="nowrap" spacing={2}>
                <Grid item container justify="flex-start" xs={6}>
                  <input
                    accept="image/*"
                    className={classes.input}
                    id="contained-button-file"
                    multiple
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
                <Grid item container justify="flex-end" xs={6}>
                  <Button
                    // variant="contained"
                    className={classes.button}
                    size="small"
                    onClick={(e) => handleSubmit(e)}
                  >
                    Post
                  </Button>
                </Grid>
              </Grid>
            </CardActions>
          </Card>
        </Box>
      </Container>
    </>
  );
};

export default Post;
