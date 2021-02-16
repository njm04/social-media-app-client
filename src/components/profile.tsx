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
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import CancelIcon from "@material-ui/icons/Cancel";
import { getUserPosts, loadPosts } from "../store/posts";
import { loadImages, getImages } from "../store/images";
import { getProfilePicture, getCoverPhoto } from "../store/users";
import { addFriend, isFriends } from "../store/friends";
import { IFriendRequest } from "../interfaces/friends";
import { IAuthUser } from "../interfaces/auth";
import { getUser } from "../store/auth";
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
      marginTop: 235,
      width: 180,
      height: 180,
      border: "4px solid black",
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
    gridList: {
      width: 918,
    },
  })
);

const Profile: React.FC<ProfileProps> = ({ location }: ProfileProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const images = useSelector(getImages);
  const user = location.state.userData;
  const userId = user._id;
  const loggedInUser: IAuthUser | null = useSelector(getUser);
  const userPosts = useSelector(getUserPosts)(userId);
  const profilePicture = useSelector(getProfilePicture)(userId);
  const coverPhoto = useSelector(getCoverPhoto)(userId);
  const isFriendsSelector = useSelector(isFriends);
  const [openModal, setOpenModal] = useState(false);
  const [openEditProfileModal, setopenEditProfileModal] = useState(false);
  const [friendData, setFriendData] = useState<IFriendRequest>();
  const [id, setPostId] = useState("");

  useEffect((): any => {
    dispatch(loadPosts());
    dispatch(loadImages());
    dispatch(loadLikes());
    dispatch(loadUsers());
  }, [dispatch]);

  useEffect((): any => {
    if (loggedInUser && loggedInUser._id) {
      const status = isFriendsSelector({
        requester: loggedInUser._id,
        recipient: userId,
      });
      if (status) setFriendData(status);
    }
  }, [loggedInUser, userId, isFriendsSelector]);

  const handleEditProfile = () => {
    setopenEditProfileModal(true);
  };

  const handleAddFriend = () => {
    if (loggedInUser && loggedInUser._id) {
      const data = {
        requester: loggedInUser._id,
        recipient: userId,
        status: "requested",
      };
      dispatch(addFriend(data));
    }
  };

  const handleCancelFriendRequest = () => {
    console.log("clicked");
  };

  const displayAddFriendButton = () => {
    if (friendData) {
      return friendData.status !== "requested" ? (
        <Grid container justify="flex-end">
          <Button
            color="primary"
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={handleAddFriend}
          >
            Add Friend
          </Button>
        </Grid>
      ) : (
        <Grid container justify="flex-end">
          <Button
            color="primary"
            variant="contained"
            startIcon={<CancelIcon />}
            onClick={handleCancelFriendRequest}
          >
            Cancel friend request
          </Button>
        </Grid>
      );
    }
    return (
      <Grid container justify="flex-end">
        <Button
          color="primary"
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={handleAddFriend}
        >
          Add Friend
        </Button>
      </Grid>
    );
  };

  const displayCoverPhoto = () => {
    if (coverPhoto) {
      return (
        <Box position="absolute" display="flex">
          <GridList cellHeight={400} className={classes.gridList} cols={1}>
            <GridListTile>
              <img alt={coverPhoto.name} src={coverPhoto.url} />
            </GridListTile>
          </GridList>
        </Box>
      );
    }
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <div className={classes.root}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Box
                bgcolor="secondary.main"
                display="flex"
                style={{
                  justifyContent: "center",
                  display: "flex",
                  height: "400px",
                }}
              >
                {displayCoverPhoto()}
                <Box zIndex="app bar" position="absolute">
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
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Box pb={3}>
                  <Typography variant="h5">{user.fullName}</Typography>
                </Box>
                <Divider variant="fullWidth" component="hr" />
                <Box pt={2}>
                  {loggedInUser && loggedInUser._id === userId ? (
                    <Button
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={handleEditProfile}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    displayAddFriendButton()
                  )}
                </Box>
              </Paper>
            </Grid>
            {loggedInUser && loggedInUser._id === userId && (
              <Grid item xs={12} sm={12}>
                <PostField />
              </Grid>
            )}

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
        cover={coverPhoto ? coverPhoto : {}}
      />
    </>
  );
};

export default Profile;
