import React, { useState, useEffect, useRef } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { red } from "@material-ui/core/colors";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
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
import { getUser } from "../../store/auth";
import { IAuthUser } from "../../interfaces/auth";
import firebase, { db } from "../../firebase.config";
import { orderBy } from "lodash";

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
      maxWidth: 350,
      height: "auto",
    },
  })
);

export interface ChatBoxProps {
  friendData: IAcceptedFriend;
  setFriendData: React.Dispatch<React.SetStateAction<IAcceptedFriend[]>>;
}

interface ISentBy {
  id: string;
  fullName: string;
}

interface IMessage {
  message: string;
  createdAt: string;
  sentBy: ISentBy;
  participants: string[];
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

  const sendMessage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (input) {
      if (authUser && authUser._id && authUser.fullName) {
        const payload = {
          message: input,
          participants: [authUser._id, friendData._id],
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          sentBy: { id: authUser._id, fullName: authUser.fullName },
        };
        db.collection("messages").add(payload);

        setMessages([...messages, payload]);
      }

      setInput("");
    }
  };

  const listItem = () => {
    return messages.map((data, index) => {
      const key = index + "" + data.participants.join("");

      return authUser && data.sentBy && authUser._id !== data.sentBy.id ? (
        <ListItem alignItems="flex-start" key={key}>
          <Card className={classes.card} style={{ backgroundColor: "#e9e9eb" }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item>
                  <Avatar
                    alt={friendData.fullName}
                    src={
                      friendData.profilePicture && friendData.profilePicture.url
                    }
                    className={classes.smallAvatar}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography component="p" style={{ wordWrap: "break-word" }}>
                    {data.message}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </ListItem>
      ) : (
        <ListItem
          key={key}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Card className={classes.card} style={{ backgroundColor: "#0b81ff" }}>
            <CardContent>
              <Grid item xs={12}>
                <Typography component="p" style={{ wordWrap: "break-word" }}>
                  {data.message}
                </Typography>
              </Grid>
            </CardContent>
          </Card>
        </ListItem>
      );
    });
  };

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
        <form noValidate autoComplete="off">
          <TextField
            value={input}
            autoComplete="off"
            id="outlined-basic"
            placeholder="Aa"
            variant="outlined"
            size="small"
            onChange={handleInput}
            // onKeyDown={onKeyEnter}
          />
          <IconButton
            disabled={!input}
            color="primary"
            aria-label="send message"
            type="submit"
            onClick={sendMessage}
          >
            <SendIcon />
          </IconButton>
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
