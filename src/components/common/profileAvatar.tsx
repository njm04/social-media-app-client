import React from "react";
import { useSelector } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import { getProfilePicture } from "../../store/users";
import { getInitials } from "../../utils/utils";

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
  const avatar = useSelector(getProfilePicture)(userId);

  return avatar && handleProfileOpen ? (
    <IconButton color="inherit" onClick={() => handleProfileOpen(userId)}>
      <Avatar alt={avatar.name} src={avatar.url} />
    </IconButton>
  ) : handleProfileOpen ? (
    <IconButton color="inherit" onClick={() => handleProfileOpen(userId)}>
      <Avatar>{getInitials(fullName)}</Avatar>
    </IconButton>
  ) : avatar ? (
    <Avatar alt={avatar.name} src={avatar.url} />
  ) : (
    <IconButton color="inherit">
      <Avatar>{getInitials(fullName)}</Avatar>
    </IconButton>
  );
};

export default ProfileAvatar;
