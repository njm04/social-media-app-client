import React, { useState } from "react";
import { orderBy } from "lodash";
import { navigate } from "@reach/router";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import Link from "@material-ui/core/Link";
import {
  IPost,
  IPostImages,
  postCommentIncremented,
  likePost,
} from "../store/posts";
import {
  loadComments,
  createComment,
  didCommentFailed,
} from "../store/comments";
import { addLike } from "../store/likes";
import { IImage } from "../store/images";
import { getUser as userAuth, IAuthUser } from "../store/auth";
import { getDate, getProfileName } from "../utils/utils";
import { getUser } from "../store/users";
import Comment from "./comment";
import ImageUploadGrid from "./imageUploadGrid";
import PostMenu from "./common/postMenu";
import EditPostModal from "./editPostModal";
import ProfileAvatar from "./common/profileAvatar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
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
    postContent: {
      textAlign: "left",
    },
    commentsCount: {
      borderBottom: "1px solid",
    },
    link: {
      cursor: "pointer",
    },
  })
);

export interface PostCardProps {
  posts: IPost[];
  images: IImage[];
}

const PostCard: React.FC<PostCardProps> = ({
  posts,
  images,
}: PostCardProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user: IAuthUser | null = useSelector(userAuth);
  const userProfile = useSelector(getUser);
  const isFailed = useSelector(didCommentFailed);
  const [show, setShow] = useState(false);
  const [id, setId] = useState("");
  const [comment, setComment] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const onKeyEnter = (e: React.KeyboardEvent<HTMLDivElement>, post: string) => {
    const userId = user && user._id;
    if (e.key === "Enter" && comment !== "") {
      dispatch(createComment({ userId, post, comment }));
      if (!isFailed) dispatch(postCommentIncremented({ post }));
      setComment("");
    }
  };

  const handleProfileOpen = (userId: string) => {
    const user = userProfile(userId);
    let userData: object = {};
    let profileNameUrl: string = "";
    if (user) {
      userData = user;
      profileNameUrl = getProfileName(userData);
    }
    navigate(`/${profileNameUrl}`, { state: { userData } });
  };

  const handleLike = (postId: string) => {
    const userId = user && user._id;
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

  const postCards = () => {
    const sorted = orderBy(posts, ["createdAt"], ["desc"]);

    if (posts.length > 0) {
      return sorted.map((item) => (
        <Box mt={2} bgcolor="background.paper" key={item._id}>
          <Card className={classes.root}>
            <CardContent className={classes.postContent}>
              <Paper className={classes.paper}>
                <Grid container wrap="nowrap" spacing={2}>
                  <Grid item>
                    <ProfileAvatar
                      userId={item.postedBy._id}
                      fullName={item.postedBy.fullName}
                      handleProfileOpen={handleProfileOpen}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      className={classes.link}
                      onClick={() => handleProfileOpen(item.postedBy._id)}
                    >
                      <Link color="inherit">{item.postedBy.fullName}</Link>
                    </Typography>
                    <Typography variant="caption" display="block" gutterBottom>
                      {getDate(item.createdAt)}
                    </Typography>
                  </Grid>
                  <Grid item container justify="flex-end" xs={6}>
                    {user && user._id === item.postedBy._id ? (
                      <PostMenu
                        postId={item._id}
                        setOpenModal={setOpenModal}
                        setId={setId}
                      />
                    ) : null}
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Box px={7} py={2}>
                    <Typography>{item.post}</Typography>
                    {displayPostImage(item.postImages)}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  {getLikes(item.likes)}
                  {getCommentsCount(item.commentCount)}
                  <Divider variant="fullWidth" component="hr" />
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      color="default"
                      fullWidth
                      startIcon={<ThumbUpAltIcon />}
                      onClick={() => handleLike(item._id)}
                    >
                      Like
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      color="default"
                      fullWidth
                      startIcon={<ChatBubbleIcon />}
                      onClick={(e) => onClickShowComments(e, item._id)}
                    >
                      Comment
                    </Button>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  {/* does item._id === id have another alternative way?*/}
                  {show && item._id === id && (
                    <>
                      <TextField
                        id={item._id}
                        value={comment}
                        variant="outlined"
                        fullWidth
                        size="small"
                        placeholder="Write a comment..."
                        onKeyDown={(e) => onKeyEnter(e, item._id)}
                        onChange={handleComment}
                      />
                      <Comment postId={item._id} key={item._id} />
                    </>
                  )}
                </Grid>
              </Paper>
            </CardContent>
          </Card>
        </Box>
      ));
    }
    return "";
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">{postCards()}</Container>
      <EditPostModal open={openModal} setOpenModal={setOpenModal} postId={id} />
    </>
  );
};

export default PostCard;
