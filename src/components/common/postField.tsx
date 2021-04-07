import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import PhotoIcon from "@material-ui/icons/Photo";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { createPost, isLoading } from "../../store/posts";
import { getUser } from "../../store/auth";
import { IAuthUser } from "../../interfaces/auth";
import { IImageData } from "../../interfaces/images";
import { storage } from "../../firebase.config";
import { useUserData } from "../../custom_hooks/useUserData";
import ImageUploadGrid from "./../imageUploadGrid";

export interface PostFieldProps {
  root?: string;
}

type ImageData = {
  name: string;
  url: string;
};

const useStyles = makeStyles({
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

const PostField: React.FC<PostFieldProps> = ({ root }: PostFieldProps) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const user: IAuthUser | null = useSelector(getUser);
  const userId = useUserData(user, "id");
  const loading = useSelector(isLoading);
  const [post, setPost] = useState("");
  const [images, setImages] = useState<IImageData[]>([]);
  const [imageData, setImageData] = useState<object[]>([]);

  const isDisabled = () => {
    if ((!post && imageData.length === 0) || loading) return true;
    return false;
  };

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
    } else if (imageData !== undefined) {
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
    <Box mt={2} bgcolor="background.paper">
      <Card className={root}>
        <CardContent>
          <TextField
            disabled={loading}
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
                id="post-uploads"
                multiple
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="post-uploads">
                <Button
                  disabled={loading}
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
                disabled={isDisabled()}
              >
                Post
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </Box>
  );
};

export default PostField;
