import React, { useState, useEffect, useRef } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import StyledBadge from "./styledBadge";
import MinimizeIcon from "@material-ui/icons/Minimize";
import CloseIcon from "@material-ui/icons/Close";
import Tooltip from "@material-ui/core/Tooltip";
import Emoji from "react-emoji-render";
import { Picker, BaseEmoji } from "emoji-mart";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InsertEmoticonTwoToneIcon from "@material-ui/icons/InsertEmoticonTwoTone";
import Popover from "@material-ui/core/Popover";
import { IAcceptedFriend } from "../../interfaces/friends";
import { getUser } from "../../store/auth";
import { IAuthUser } from "../../interfaces/auth";
import firebase, { db } from "../../firebase.config";
import { orderBy } from "lodash";
import { isOnline } from "../../utils/utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: "40ch",
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
    cardHeader: {
      backgroundColor: "#757de8",
    },
    cardActions: {
      backgroundColor: "white",
      border: "1px solid",
    },
    minimizedChatBox: {
      marginTop: 350,
    },
    cardContentMessages: { height: 300, overflow: "auto" },
    smallAvatar: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    card: {
      maxWidth: 150,
      height: "auto",
    },
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
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<firebase.firestore.DocumentData[]>(
    []
  );
  const [firstSnapShotMsg, setFirstSnapShotMsg] = useState<
    firebase.firestore.DocumentData[]
  >([]);
  const [secondSnapShotMsg, setSecondSnapShotMsg] = useState<
    firebase.firestore.DocumentData[]
  >([]);
  const messageListRef = useRef<HTMLDivElement>(null);
  const authUser: IAuthUser | null = useSelector(getUser);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect((): any => {
    // scroll to bottom when message list overlaps the card content height
    if (messageListRef.current)
      messageListRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
  });

  useEffect((): any => {
    setMessages(
      orderBy(
        [...firstSnapShotMsg, ...secondSnapShotMsg],
        ["createdAt"],
        ["asc"]
      )
    );
  }, [firstSnapShotMsg, secondSnapShotMsg]);

  useEffect((): any => {
    if (authUser && authUser._id) {
      // because firestore queries doesnt have a logical OR operator
      // two queries are made which has different order of userIds
      // inside the participants field.
      db.collection("messages")
        .where("participants", "in", [[authUser._id, friendData._id]])
        .onSnapshot((snapshot) => {
          setFirstSnapShotMsg(snapshot.docs.map((doc) => doc.data()));
        });

      db.collection("messages")
        .where("participants", "in", [[friendData._id, authUser._id]])
        .onSnapshot((snapshot) => {
          setSecondSnapShotMsg(snapshot.docs.map((doc) => doc.data()));
        });
    }
  }, [authUser, friendData._id]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleEmojiSelect = (emoji: BaseEmoji) => {
    if (emoji && emoji.colons) setInput(`${input} ${emoji.native} `);
  };

  const sendMessage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (input) {
      if (authUser && authUser._id && authUser.fullName) {
        const payload = {
          message: input,
          participants: [authUser._id, friendData._id],
          createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
          sentBy: { id: authUser._id, fullName: authUser.fullName },
        };
        db.collection("messages").add(payload);

        setMessages([...messages, payload]);
      }

      setInput("");
    }
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

  const handleOpenEmojiPicker = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseEmojiPicker = () => {
    setAnchorEl(null);
  };

  const renderEmojiPopover = () => {
    return (
      // FIX: popover disables scrolling better to use popper
      <Popover
        id={id}
        open={open}
        anchorReference="anchorPosition"
        anchorPosition={{ top: 450, left: 1643 }}
        onClose={handleCloseEmojiPicker}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {/* TODO: make this picker a reusable component */}
        <Picker set="facebook" onSelect={handleEmojiSelect} title="" />
      </Popover>
    );
  };

  const messageTime = (createdAt: firebase.firestore.Timestamp) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };

    return (
      <Typography variant="body2" color="textSecondary">
        {createdAt.toDate().toLocaleString("en-US", options)}
      </Typography>
    );
  };

  const listItem = () => {
    return messages.map((data, index) => {
      const key = index + "" + data.participants.join("");

      return authUser && data.sentBy && authUser._id !== data.sentBy.id ? (
        <ListItem alignItems="flex-start" key={key}>
          <Grid>
            <Grid item xs={12}>
              <Card
                className={classes.card}
                style={{ backgroundColor: "#e9e9eb" }}
              >
                <CardContent>
                  <Grid container spacing={1}>
                    <Grid item>
                      <Avatar
                        alt={friendData.fullName}
                        src={
                          friendData.profilePicture &&
                          friendData.profilePicture.url
                        }
                        className={classes.smallAvatar}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <div style={{ wordWrap: "break-word" }}>
                        <Emoji text={data.message} />
                      </div>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              {messageTime(data.createdAt)}
            </Grid>
          </Grid>
        </ListItem>
      ) : (
        <ListItem
          key={key}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Grid>
            <Grid item xs={12}>
              <Card
                className={classes.card}
                style={{ backgroundColor: "#0b81ff" }}
              >
                <CardContent>
                  <Grid item xs={12}>
                    <div style={{ wordWrap: "break-word" }}>
                      <Emoji text={data.message} />
                    </div>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              {messageTime(data.createdAt)}
            </Grid>
          </Grid>
        </ListItem>
      );
    });
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
        <div ref={messageListRef}>
          <List>{listItem()}</List>
        </div>
      </CardContent>
      <CardActions>
        {renderEmojiPopover()}
        <form noValidate autoComplete="off">
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item xs={10}>
              <FormControl size="small">
                <OutlinedInput
                  value={input}
                  onChange={handleInput}
                  id="chatbox-message"
                  placeholder="Aa"
                  autoComplete="off"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="emoji picker"
                        onClick={handleOpenEmojiPicker}
                      >
                        <InsertEmoticonTwoToneIcon
                          style={{ color: "#af861f" }}
                        />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <IconButton
                disabled={!input}
                color="primary"
                aria-label="send message"
                type="submit"
                onClick={sendMessage}
              >
                <SendIcon />
              </IconButton>
            </Grid>
          </Grid>
        </form>
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
            src={friendData.profilePicture && friendData.profilePicture.url}
            alt={friendData.fullName}
          />
        </StyledBadge>
      </IconButton>
    </Tooltip>
  );
};

export default ChatBox;
