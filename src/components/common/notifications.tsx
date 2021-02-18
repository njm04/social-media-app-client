import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { navigate } from "@reach/router";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { IFriendRequest } from "../../interfaces/friends";
import { getUser } from "../../store/users";
import { IUser } from "../../interfaces/users";
import { getProfileName } from "../../utils/utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    paper: {
      marginRight: theme.spacing(2),
    },
    popper: { maxWidth: "30ch", width: "100%" },
  })
);

export interface NotificationsProps {
  friendRequest: IFriendRequest[];
  friendRequestBadge: number;
}

const Notifications: React.FC<NotificationsProps> = ({
  friendRequest,
  friendRequestBadge,
}: NotificationsProps) => {
  const classes = useStyles();
  const friendData = useSelector(getUser);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<(IUser | undefined)[]>();
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
    const requests = friendRequest.map((request) =>
      friendData(request.requester)
    );
    setNotifications(requests);
  };

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const handleProfileOpen = (
    id: string,
    event: React.MouseEvent<EventTarget>
  ) => {
    const user = friendData(id);
    let userData: object = {};
    let profileNameUrl: string = "";
    if (user) {
      userData = user;
      profileNameUrl = getProfileName(userData);
    }
    navigate(`/${profileNameUrl}`, { state: { userData } });

    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  const renderMenuItem = (user: IUser | undefined) => {
    if (user) {
      return (
        <MenuItem
          onClick={(e) => handleProfileOpen(user._id, e)}
          key={user._id}
        >
          <ListItemAvatar>
            <Avatar
              alt={user.fullName}
              src={user.profilePicture && user.profilePicture.url}
            />
          </ListItemAvatar>
          <p>{user.fullName}</p>
        </MenuItem>
      );
    }

    return null;
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <IconButton
        aria-label="show 17 new notifications"
        color="inherit"
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge badgeContent={friendRequestBadge} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      {notifications && notifications.length > 0 ? (
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
          className={classes.popper}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDown}
                  >
                    {notifications &&
                      notifications.map((user) => renderMenuItem(user))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      ) : (
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
          className={classes.popper}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem>
                      <h3 style={{ color: "black" }}>No results</h3>
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      )}
    </>
  );
};

export default Notifications;
