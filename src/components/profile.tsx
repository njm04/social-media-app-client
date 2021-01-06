import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import { getUserPosts, loadPosts } from "../store/posts";
import { loadImages, getImages } from "../store/images";
import { getProfilePicture } from "../store/users";
import { loadUsers } from "../store/users";
import { loadLikes } from "../store/likes";
import { getInitials } from "../utils/utils";
import EditPostModal from "./editPostModal";
import PostCard from "./common/postCards";
import EditProfileModal from "./editProfileModal";
import PostField from "./common/postField";

export interface ProfileProps {
  location: any;
  name: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: "80px",
    },
    paper: {
      // margin: `${theme.spacing(1)}px auto`,
      padding: theme.spacing(2),
    },
    avatar: {
      marginTop: 140,
      width: 180,
      height: 180,
    },
    card: {
      minWidth: 275,
      flexGrow: 1,
      overflow: "hidden",
      padding: theme.spacing(0, 3),
    },
    postContent: {
      textAlign: "left",
    },
    commentsCount: {
      borderBottom: "1px solid",
    },
  })
);

const Profile: React.FC<ProfileProps> = ({ location }: ProfileProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const images = useSelector(getImages);
  const user = location.state.userData;
  const userId = user._id;
  const userPosts = useSelector(getUserPosts)(userId);
  const profilePicture = useSelector(getProfilePicture)(userId);
  const [openModal, setOpenModal] = useState(false);
  const [openEditProfileModal, setopenEditProfileModal] = useState(false);
  const [id, setPostId] = useState("");

  useEffect((): any => {
    dispatch(loadPosts());
    dispatch(loadImages());
    dispatch(loadLikes());
    dispatch(loadUsers());
  }, [dispatch]);

  const handleEditProfile = () => {
    setopenEditProfileModal(true);
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg">
        <div className={classes.root}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Box
                bgcolor="secondary.main"
                display="flex"
                style={{
                  justifyContent: "center",
                  display: "flex",
                  height: "300px",
                }}
              >
                {profilePicture ? (
                  <Avatar
                    className={classes.avatar}
                    alt={profilePicture.name}
                    src={profilePicture.url}
                  />
                ) : (
                  <Avatar className={classes.avatar}>
                    {getInitials(user.fullName)}
                  </Avatar>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Box pb={3}>
                  <Typography variant="h5">{user.fullName}</Typography>
                </Box>
                <Divider variant="fullWidth" component="hr" />
                <Box pt={2}>
                  <Button
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={handleEditProfile}
                  >
                    Edit Profile
                  </Button>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={12}>
              <PostField />
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <Paper className={classes.paper}>xs=12 sm=6</Paper>
            </Grid> */}
            <Grid item xs={12} sm={12}>
              <PostCard
                userId={userId}
                posts={userPosts}
                images={images}
                setPostId={setPostId}
                setOpenModal={setOpenModal}
              />
            </Grid>
          </Grid>
        </div>
      </Container>
      <EditPostModal open={openModal} setOpenModal={setOpenModal} postId={id} />
      <EditProfileModal
        open={openEditProfileModal}
        setopenEditProfileModal={setopenEditProfileModal}
        userId={userId}
        profImage={profilePicture ? profilePicture : {}}
      />
    </>
  );
};

export default Profile;
