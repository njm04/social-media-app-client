import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "@reach/router";
import Typography from "@material-ui/core/Typography";
import { loadPosts, getAllPosts } from "../store/posts";
import NavBar from "./common/navBar";
import Post from "./post";
import PostCard from "./postCard";

export interface NewsFeedProps extends RouteComponentProps {}

const NewsFeed: React.FC<NewsFeedProps> = () => {
  const dispatch = useDispatch();
  const posts = useSelector(getAllPosts);

  useEffect((): any => dispatch(loadPosts()), [dispatch]);

  return (
    <>
      <NavBar />
      <Post />
      <PostCard posts={posts} />
    </>
  );
};

export default NewsFeed;
