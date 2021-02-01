import React from "react";
import { navigate } from "@reach/router";
import { useSelector } from "react-redux";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Grid from "@material-ui/core/Grid";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import { IUserSearched } from "../../interfaces/users";
import { getUser } from "../../store/users";
import { getProfileName } from "../../utils/utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: "36ch",
      backgroundColor: theme.palette.background.paper,
      color: "black",
    },
    inline: {
      display: "inline",
    },
  })
);

export interface FriendListProps {
  searchResults: IUserSearched[];
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const FriendList: React.FC<FriendListProps> = ({
  searchResults,
  setSearchQuery,
}: FriendListProps) => {
  const classes = useStyles();
  const userProfile = useSelector(getUser);

  const handleProfileOpen = (id: string) => {
    const user = userProfile(id);
    let userData: object = {};
    let profileNameUrl: string = "";
    if (user) {
      userData = user;
      profileNameUrl = getProfileName(userData);
    }
    navigate(`/${profileNameUrl}`, { state: { userData } });
    setSearchQuery("");
  };

  return (
    <List className={classes.root}>
      {searchResults.length > 0 ? (
        searchResults.map((result) => (
          <div key={result._id}>
            <ListItem
              alignItems="flex-start"
              onClick={() => handleProfileOpen(result._id)}
            >
              <Grid container spacing={3}>
                <Grid item xs={3}>
                  <ListItemAvatar>
                    <Avatar
                      alt={result.fullName}
                      src={result.profilePicture && result.profilePicture.url}
                    />
                  </ListItemAvatar>
                </Grid>
                <Grid item xs={9}>
                  <p>{result.fullName}</p>
                </Grid>
              </Grid>
            </ListItem>
          </div>
        ))
      ) : (
        <h3 style={{ color: "black" }}>No results</h3>
      )}
    </List>
  );
};

export default FriendList;
