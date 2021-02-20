import React from "react";
import { useSelector } from "react-redux";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import { getProfilePicture, getUser } from "../../store/users";
import { getInitials } from "../../utils/utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    customBadge: {
      backgroundColor: "#44b700",
    },
  })
);

export interface ProfileAvatarProps {
  userId: string;
  fullName: string;
  handleProfileOpen?(userId: string): void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  userId,
  fullName,
  handleProfileOpen,
}: ProfileAvatarProps) => {
  const classes = useStyles();
  const user = useSelector(getUser)(userId);
  const avatar = useSelector(getProfilePicture)(userId);

  const isOnline = () => {
    if (user && user.status === "active") return false;
    return true;
  };

  const renderAvatar = () => {
    if (avatar && handleProfileOpen) {
      return (
        <IconButton color="inherit" onClick={() => handleProfileOpen(userId)}>
          <Badge
            classes={{ badge: classes.customBadge }}
            overlap="circle"
            badgeContent=" "
            invisible={isOnline()}
            variant="dot"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <Avatar alt={avatar.name} src={avatar.url} />
          </Badge>
        </IconButton>
      );
    } else if (handleProfileOpen) {
      return (
        <IconButton color="inherit" onClick={() => handleProfileOpen(userId)}>
          <Badge
            classes={{ badge: classes.customBadge }}
            overlap="circle"
            badgeContent=" "
            invisible={isOnline()}
            variant="dot"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <Avatar>{getInitials(fullName)}</Avatar>
          </Badge>
        </IconButton>
      );
    } else if (avatar) {
      return (
        <Badge
          classes={{ badge: classes.customBadge }}
          overlap="circle"
          badgeContent=" "
          invisible={isOnline()}
          variant="dot"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Avatar alt={avatar.name} src={avatar.url} />
        </Badge>
      );
    } else {
      return (
        <IconButton color="inherit">
          <Avatar>{getInitials(fullName)}</Avatar>
        </IconButton>
      );
    }
  };

  return renderAvatar();
};

export default ProfileAvatar;
