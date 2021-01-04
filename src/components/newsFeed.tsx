import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "@reach/router";
import { loadPosts, getAllPosts } from "../store/posts";
import { loadImages, getImages } from "../store/images";
import { loadLikes } from "../store/likes";
import Post from "./post";
import PostCard from "./postCard";

export interface NewsFeedProps extends RouteComponentProps {}

const NewsFeed: React.FC<NewsFeedProps> = () => {
  const dispatch = useDispatch();
  const posts = useSelector(getAllPosts);
  const images = useSelector(getImages);

  useEffect((): any => {
    dispatch(loadPosts());
    dispatch(loadImages());
    dispatch(loadLikes());
  }, [dispatch]);

  return (
    <>
      <Post />
      <PostCard posts={posts} images={images} />
    </>
  );
};

export default NewsFeed;
