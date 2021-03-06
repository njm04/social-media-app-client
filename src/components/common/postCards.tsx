import React, { useState } from "react";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { orderBy } from "lodash";
import { navigate } from "@reach/router";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  postCommentIncremented,
  likePost,
  deletePost,
} from "../../store/posts";
import { IPost, IPostImages } from "../../interfaces/posts";
import {
  loadComments,
  createComment,
  didCommentFailed,
  isLoading,
} from "../../store/comments";
import { deleteImage } from "../../store/images";
import { IImage } from "../../interfaces/images";
import { addLike } from "../../store/likes";
import { getDate, getProfileName } from "../../utils/utils";
import { getUser } from "../../store/users";
import Comment from "../comment";
import ImageUploadGrid from "../imageUploadGrid";
import PostMenu from "./postMenu";
import ProfileAvatar from "../common/profileAvatar";
import DeleteModal from "../common/deleteModal";

export interface PostCardProps {
  posts: IPost[];
  images: IImage[];
  userId: string;
  setPostId?: React.Dispatch<React.SetStateAction<string>>;
  setOpenModal?: React.Dispatch<React.SetStateAction<boolean>>;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      height: "360px",
      width: "640px",
      // overflow: "hidden",
      // backgroundColor: theme.palette.background.paper,
    },
    paper: {
      margin: `${theme.spacing(1)}px auto`,
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
    link: {
      cursor: "pointer",
    },
    gridList: {
      flexWrap: "nowrap",
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: "translateZ(0)",
    },
  })
);

const PostCard: React.FC<PostCardProps> = ({
  posts,
  userId,
  images,
  setPostId,
  setOpenModal,
}: PostCardProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isFailed = useSelector(didCommentFailed);
  const userProfile = useSelector(getUser);
  const loading = useSelector(isLoading);
  const sorted = orderBy(posts, ["createdAt"], ["desc"]);
  const [show, setShow] = useState(false);
  const [id, setId] = useState("");
  const [comment, setComment] = useState("");
  const [openDeletePostModal, setOpenDeletePostModal] = useState(false);

  const onKeyEnter = (e: React.KeyboardEvent<HTMLDivElement>, post: string) => {
    if (e.key === "Enter" && comment !== "") {
      dispatch(createComment({ userId, post, comment }));
      if (!isFailed) dispatch(postCommentIncremented({ post }));
      setComment("");
    }
  };

  const handleLike = (postId: string) => {
    dispatch(likePost({ postId, userId }));
    dispatch(addLike({ postId, userId }));
  };

  const onClickShowComments = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    postId: string
  ) => {
    e.preventDefault();
    setShow(true);
    setId(postId);
    dispatch(loadComments(postId));
  };

  const handleComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleEditPost = (postId: string) => {
    if (setOpenModal && setPostId) {
      setOpenModal(true);
      setPostId(postId);
    }
  };

  const handleDeletePost = (postId: string) => {
    dispatch(deletePost(postId));
    dispatch(deleteImage(postId));
  };

  const handleProfileOpen = (id: string) => {
    const user = userProfile(id);
    let userData: object = {};
    let profileNameUrl: string = "";
    if (user) {
      userData = user;
      profileNameUrl = getProfileName(userData);
    }
    navigate(`/${profileNameUrl}`, { state: { userData } });
  };

  const getLikes = (likes: number) => {
    if (likes) {
      const likesCount =
        likes === 0 ? "" : likes === 1 ? `${likes} like` : `${likes} likes`;
      return <Typography align="left">{likesCount}</Typography>;
    }
    return "";
  };

  const getCommentsCount = (count: number) => {
    const commentsCount =
      count === 1 ? `${count} Comment` : count > 1 ? `${count} Comments` : "";
    return <Typography align="right">{commentsCount}</Typography>;
  };

  const displayPostImage = (postImages: IPostImages[]) => {
    if (postImages && postImages.length > 0) {
      if (postImages.length === 1) {
        return <ImageUploadGrid images={postImages} cols={1} />;
      } else if (images.length === 2) {
        return <ImageUploadGrid images={postImages} cols={2} />;
      } else {
        return <ImageUploadGrid images={postImages} cols={2} />;
      }
    }

    return;
  };

  const isUrl = (post: string) => {
    let height = "360px";
    const urlPattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    const fbUrlPattern = /^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9(.?)?]/;
    if (fbUrlPattern.test(post)) height = "100%";
    if (urlPattern.test(post.toLocaleLowerCase()))
      return (
        <ReactPlayer url={post} controls={true} width="100%" height={height} />
      );
    return <Typography>{post}</Typography>;
  };

  return (
    <>
      {sorted.map((post) => (
        <Box mt={2} bgcolor="background.paper" key={post._id}>
          <Card className={classes.card}>
            <CardContent className={classes.postContent}>
              <Grid container wrap="nowrap" spacing={2}>
                <Grid item>
                  <ProfileAvatar
                    userId={post.postedBy._id}
                    fullName={post.postedBy.fullName}
                    handleProfileOpen={handleProfileOpen}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    className={classes.link}
                    onClick={() => handleProfileOpen(post.postedBy._id)}
                  >
                    {post.postedBy.fullName}
                  </Typography>
                  <Typography variant="caption" display="block" gutterBottom>
                    {getDate(post.createdAt)}
                  </Typography>
                </Grid>
                <Grid item container justify="flex-end" xs={6}>
                  {userId === post.postedBy._id ? (
                    <PostMenu
                      postId={post._id}
                      handleEditPost={handleEditPost}
                      setPostId={setId}
                      setOpenDeletePostModal={setOpenDeletePostModal}
                    />
                  ) : null}
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Box px={7} py={2}>
                  {isUrl(post.post)}
                  {displayPostImage(post.postImages)}
                </Box>
              </Grid>
              <Grid item xs={12}>
                {getLikes(post.likes)}
                {getCommentsCount(post.commentCount)}
                <Divider variant="fullWidth" component="hr" />
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    color="default"
                    fullWidth
                    startIcon={<ThumbUpAltIcon />}
                    onClick={() => handleLike(post._id)}
                  >
                    Like
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    color="default"
                    fullWidth
                    startIcon={<ChatBubbleIcon />}
                    onClick={(e) => onClickShowComments(e, post._id)}
                  >
                    Comment
                  </Button>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                {/* does item._id === id have another alternative way?*/}
                {show && post._id === id && (
                  <>
                    <TextField
                      id={post._id}
                      value={comment}
                      variant="outlined"
                      fullWidth
                      size="small"
                      placeholder="Write a comment..."
                      onKeyDown={(e) => onKeyEnter(e, post._id)}
                      onChange={handleComment}
                    />
                    {loading ? (
                      <Grid container justify="center">
                        <Box mt={2}>
                          <CircularProgress />
                        </Box>
                      </Grid>
                    ) : (
                      <Comment
                        postId={post._id}
                        key={post._id}
                        userId={userId}
                      />
                    )}
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      ))}
      <DeleteModal
        postId={id}
        open={openDeletePostModal}
        setOpenDeletePostModal={setOpenDeletePostModal}
        handleDeletePost={handleDeletePost}
      />
    </>
  );
};

export default PostCard;
