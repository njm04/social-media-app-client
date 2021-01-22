import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { FaEllipsisH } from "react-icons/fa";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export interface PostMenuProps {
  postId?: string;
  commentId?: string;
  setCommentId?: React.Dispatch<React.SetStateAction<string>>;
  setOpenDeleteCommentModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setPostId?: React.Dispatch<React.SetStateAction<string>>;
  setOpenDeletePostModal?: React.Dispatch<React.SetStateAction<boolean>>;
  handleEditPost?(postId: string): void;
}

const PostMenu: React.FC<PostMenuProps> = ({
  postId,
  commentId,
  handleEditPost,
  setCommentId,
  setOpenDeleteCommentModal,
  setPostId,
  setOpenDeletePostModal,
}: PostMenuProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    if (handleEditPost && postId) handleEditPost(postId);
    setAnchorEl(null);
  };

  const handleDelete = () => {
    if (setOpenDeletePostModal && setPostId && postId) {
      setPostId(postId);
      setOpenDeletePostModal(true);
    }

    if (setOpenDeleteCommentModal && setCommentId && commentId) {
      setCommentId(commentId);
      setOpenDeleteCommentModal(true);
    }

    setAnchorEl(null);
  };

  const buttonText = () => {
    if (postId) return { edit: "Edit post", delete: "Delete post" };
    if (commentId) return { edit: "Edit comment", delete: "Delete comment" };
    return { edit: "", delete: "" };
  };

  const buttonSize = () => {
    if (postId) return "medium";
    if (commentId) return "small";
    return "medium";
  };

  return (
    <div>
      <IconButton
        color="default"
        aria-label="post"
        size={buttonSize()}
        aria-controls="customized-menu"
        aria-haspopup="true"
        component="span"
        onClick={handleClick}
      >
        <FaEllipsisH />
      </IconButton>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={buttonText().edit} />
        </StyledMenuItem>
        <StyledMenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={buttonText().delete} />
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
};

export default PostMenu;
