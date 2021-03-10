import React, { useState, useEffect } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import SendIcon from "@material-ui/icons/Send";
import StyledBadge from "./styledBadge";
import MinimizeIcon from "@material-ui/icons/Minimize";
import CloseIcon from "@material-ui/icons/Close";
import Tooltip from "@material-ui/core/Tooltip";
import { IAcceptedFriend } from "../../interfaces/friends";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: "36ch",
      backgroundColor: theme.palette.background.paper,
      padding: 0,
    },
    inline: {
      display: "inline",
    },
    title: {
      color: "black",
    },
    subheader: { marginRight: 100 },
    avatar: {
      backgroundColor: red[500],
    },
    cardHeader: {
      backgroundColor: "#757de8",
    },
    cardActions: {
      backgroundColor: "white",
      border: "1px solid",
    },
    minimizedChatBox: {
      marginTop: 450,
    },
    cardContentMessages: { height: 300, overflow: "auto" },
  })
);

export interface ChatBoxProps {
  friendData: IAcceptedFriend;
  setFriendData: React.Dispatch<React.SetStateAction<IAcceptedFriend[]>>;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  friendData,
  setFriendData,
}: ChatBoxProps) => {
  const classes = useStyles();
  const [minimize, setMinimize] = useState(false);

  const isOnline = (status: string) => {
    if (status === "active") return false;
    return true;
  };

  const handleClose = () => {
    setFriendData((data) => {
      const index = data.findIndex((friend) => friend._id === friendData._id);
      data.splice(index, 1);
      return [...data];
    });
  };

  const toggleMinimize = () => {
    setMinimize(minimize ? false : true);
  };

  return !minimize ? (
    <Card className={classes.root} variant="outlined">
      <CardHeader
        className={classes.cardHeader}
        classes={{ title: classes.title }}
        avatar={
          <StyledBadge
            overlap="circle"
            invisible={isOnline(friendData.status)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            variant="dot"
          >
            <Avatar
              aria-label="avatar"
              className={classes.avatar}
              src={friendData.profilePicture && friendData.profilePicture.url}
              alt={friendData.fullName}
            />
          </StyledBadge>
        }
        action={
          <>
            <IconButton
              aria-label="minimize"
              size="small"
              onClick={toggleMinimize}
            >
              <MinimizeIcon />
            </IconButton>
            <IconButton aria-label="close" size="small" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </>
        }
        title={friendData.fullName}
        subheader={friendData.status === "active" ? "active now" : ""}
      />
      <CardContent className={classes.cardContentMessages}>
        <List className={classes.root}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary="Brunch this weekend?"
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    Ali Connors
                  </Typography>
                  {" — I'll be in your neighborhood doing errands this…"}
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary="Summer BBQ"
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    to Scott, Alex, Jennifer
                  </Typography>
                  {" — Wish I could come, but I'm out of town this…"}
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary="Oui Oui"
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    Sandra Adams
                  </Typography>
                  {" — Do you have Paris recommendations? Have you ever…"}
                </React.Fragment>
              }
            />
          </ListItem>
        </List>
      </CardContent>
      <CardActions>
        <TextField
          id="outlined-basic"
          placeholder="Aa"
          variant="outlined"
          size="small"
        />
        <IconButton color="primary" aria-label="send message">
          <SendIcon />
        </IconButton>
      </CardActions>
    </Card>
  ) : (
    <Tooltip title={friendData.fullName} placement="top" arrow>
      <IconButton
        aria-label="minimize"
        className={classes.minimizedChatBox}
        onClick={toggleMinimize}
      >
        <StyledBadge
          overlap="circle"
          invisible={isOnline(friendData.status)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          variant="dot"
        >
          <Avatar
            aria-label="avatar"
            className={classes.avatar}
            src={friendData.profilePicture && friendData.profilePicture.url}
            alt={friendData.fullName}
          />
        </StyledBadge>
      </IconButton>
    </Tooltip>
  );
};

export default ChatBox;
