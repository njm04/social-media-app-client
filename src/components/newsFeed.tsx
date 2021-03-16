import React, { useEffect, useState } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "@reach/router";
import { loadPosts, getAllPosts, isLoading } from "../store/posts";
import { loadImages, getImages } from "../store/images";
import Container from "@material-ui/core/Container";
import { loadLikes } from "../store/likes";
import { getUser } from "../store/auth";
import { IAuthUser } from "../interfaces/auth";
import { IAcceptedFriend } from "../interfaces/friends";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Post from "./post";
import PostCard from "./common/postCards";
import EditPostModal from "./editPostModal";
import FriendsListDrawer from "./friendsListDrawer";
import Chat from "./common/chatBox";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      top: "auto",
      bottom: 0,
      zIndex: theme.zIndex.drawer + 1,
      height: 0,
    },
    grow: {
      flexGrow: 1,
    },
    chatBox: {
      marginLeft: 5,
      marginBottom: 500,
    },
    toolbar: {
      marginLeft: "auto",
    },
  })
);

export interface NewsFeedProps extends RouteComponentProps {}

const NewsFeed: React.FC<NewsFeedProps> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user: IAuthUser | null = useSelector(getUser);
  const posts = useSelector(getAllPosts);
  const loading = useSelector(isLoading);
  const images = useSelector(getImages);
  const [id, setPostId] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [friendData, setFriendData] = useState<IAcceptedFriend[]>([]);

  useEffect((): any => {
    dispatch(loadPosts());
    dispatch(loadImages());
    dispatch(loadLikes());
  }, [dispatch]);

  const userId = (): string => {
    if (user && user._id) return user._id;
    return "";
  };

  return (
    <>
      <Post />
      <Container maxWidth="md">
        {loading ? (
          <Box mt={2}>
            <CircularProgress />
          </Box>
        ) : (
          <PostCard
            posts={posts}
            images={images}
            userId={userId()}
            setPostId={setPostId}
            setOpenModal={setOpenModal}
          />
        )}
      </Container>
      <FriendsListDrawer setFriendData={setFriendData} />
      <EditPostModal open={openModal} setOpenModal={setOpenModal} postId={id} />
      <AppBar
        position="fixed"
        color="transparent"
        elevation={0}
        className={classes.appBar}
      >
        <Toolbar className={classes.toolbar}>
          {friendData.map(
            (data) =>
              friendData.length > 0 && (
                <div className={classes.chatBox} key={data._id}>
                  <Chat friendData={data} setFriendData={setFriendData} />
                </div>
              )
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NewsFeed;
