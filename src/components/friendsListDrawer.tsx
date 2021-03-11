import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import { loadAcceptedFriends, getAcceptedFriends } from "../store/friends";
import StyledBadge from "./common/styledBadge";
import { IAcceptedFriend } from "../interfaces/friends";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: "auto",
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  })
);

export interface FriendsListDrawerProps {
  setFriendData: React.Dispatch<React.SetStateAction<IAcceptedFriend[]>>;
}

const FriendsListDrawer: React.FC<FriendsListDrawerProps> = ({
  setFriendData,
}: FriendsListDrawerProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const friends = useSelector(getAcceptedFriends);

  useEffect((): any => {
    dispatch(loadAcceptedFriends());
    // to check for accepted friend status
    //TODO: fix interval still running after logout
    setInterval(() => {
      console.log("running every minute");
      dispatch(loadAcceptedFriends());
    }, 60000);
  }, [dispatch]);

  const handleClick = (friend: IAcceptedFriend) => {
    setFriendData((friendData) => {
      if (!friendData.includes(friend)) return [...friendData, friend];
      return friendData;
    });
  };

  const isOnline = (status: string) => {
    if (status === "active") return false;
    return true;
  };

  if (friends.length > 0) {
    return (
      <div className={classes.root}>
        <CssBaseline />
        <Drawer
          className={classes.drawer}
          variant="permanent"
          anchor="right"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <Toolbar />
          <div className={classes.drawerContainer}>
            <List>
              {friends.map((friend) => (
                <ListItem
                  button
                  key={friend._id}
                  onClick={() => handleClick(friend)}
                >
                  <ListItemAvatar>
                    <StyledBadge
                      overlap="circle"
                      invisible={isOnline(friend.status)}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      variant="dot"
                    >
                      <Avatar
                        alt={friend.fullName}
                        src={
                          friend.profilePicture && friend.profilePicture.url
                            ? friend.profilePicture.url
                            : ""
                        }
                      />
                    </StyledBadge>
                  </ListItemAvatar>
                  <ListItemText primary={friend.fullName} />
                </ListItem>
              ))}
            </List>
          </div>
        </Drawer>
      </div>
    );
  } else {
    return null;
  }
};

export default FriendsListDrawer;
