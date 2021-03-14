import React from "react";
import {
  fade,
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Box from "@material-ui/core/Box";
import FriendList from "./friendList";
import { IUserSearched } from "../../interfaces/users";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    inputRoot: {
      color: "inherit",
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
  })
);

export interface SearchProps {
  handleSearch(e: React.ChangeEvent<HTMLInputElement>): void;
  searchResults: IUserSearched[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const Search: React.FC<SearchProps> = ({
  handleSearch,
  searchResults,
  searchQuery,
  setSearchQuery,
}: SearchProps) => {
  const classes = useStyles();

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Search people..."
        value={searchQuery}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ "aria-label": "search" }}
        onChange={handleSearch}
      />

      {searchQuery && searchResults.length > 0 ? (
        <Box zIndex="app bar" position="absolute" pt={1} width="100%">
          <FriendList
            searchResults={searchResults}
            setSearchQuery={setSearchQuery}
          />
        </Box>
      ) : searchQuery && searchResults.length === 0 ? (
        <Box zIndex="app bar" position="absolute" pt={1} width="100%">
          <FriendList
            searchResults={searchResults}
            setSearchQuery={setSearchQuery}
          />
        </Box>
      ) : null}
    </div>
  );
};

export default Search;
