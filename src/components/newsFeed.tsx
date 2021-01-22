import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "@reach/router";
import { loadPosts, getAllPosts } from "../store/posts";
import { loadImages, getImages } from "../store/images";
import Container from "@material-ui/core/Container";
import { loadLikes } from "../store/likes";
import Post from "./post";
import PostCard from "./common/postCards";
import EditPostModal from "./editPostModal";

export interface NewsFeedProps extends RouteComponentProps {}

const NewsFeed: React.FC<NewsFeedProps> = () => {
  const dispatch = useDispatch();
  const posts = useSelector(getAllPosts);
  const images = useSelector(getImages);
  const [id, setPostId] = useState("");
  const [openModal, setOpenModal] = useState(false);

  useEffect((): any => {
    dispatch(loadPosts());
    dispatch(loadImages());
    dispatch(loadLikes());
  }, [dispatch]);

  return (
    <>
      <Post />
      <Container maxWidth="md">
        <PostCard
          posts={posts}
          images={images}
          setPostId={setPostId}
          setOpenModal={setOpenModal}
        />
      </Container>
      <EditPostModal open={openModal} setOpenModal={setOpenModal} postId={id} />
    </>
  );
};

export default NewsFeed;
