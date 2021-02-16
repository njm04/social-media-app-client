import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Avatar from "@material-ui/core/Avatar";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import Search from "./search";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedOut, getUser } from "../../store/auth";
import { IAuthUser } from "../../interfaces/auth";
import {
  getFriends,
  loadFriendRequestNotifications,
} from "../../store/friends";
import auth from "../../services/authService";
import { getInitials, getProfileName } from "./../../utils/utils";
import { getProfilePicture } from "../../store/users";
import { IUserSearched } from "../../interfaces/users";
import { search } from "../../services/searchFriendService";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      display: "none",
      cursor: "pointer",
      [theme.breakpoints.up("sm")]: {
        display: "block",
      },
    },
    sectionDesktop: {
      display: "none",
      [theme.breakpoints.up("md")]: {
        display: "flex",
      },
    },
    sectionMobile: {
      display: "flex",
      [theme.breakpoints.up("md")]: {
        display: "none",
      },
    },
    userName: {
      marginLeft: "10px",
    },
  })
);

export interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = () => {
  const dispatch = useDispatch();
  const user: IAuthUser | null = useSelector(getUser);
  const userId = user && user._id ? user._id : "";
  const profilePicture = useSelector(getProfilePicture)(userId);
  const friendRequest = useSelector(getFriends)(userId);
  const [name] = useState<string>(user && user.fullName ? user.fullName : "");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<IUserSearched[]>();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [
    mobileMoreAnchorEl,
    setMobileMoreAnchorEl,
  ] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect((): any => {
    async function searchFriend() {
      setSearchResults(await search(searchQuery));
    }
    searchFriend();
  }, [searchQuery]);

  useEffect((): any => {
    dispatch(loadFriendRequestNotifications());
  }, [dispatch]);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleProfileOpen = (event: React.MouseEvent<HTMLElement>) => {
    let userData: IAuthUser = {};
    let profileNameUrl: string = "";
    if (user) {
      userData = user;
      profileNameUrl = getProfileName(userData);
    }
    navigate(`/${profileNameUrl}`, { state: { userData } });
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleLogout = () => {
    auth.logout();
    dispatch(userLoggedOut({}));
    navigate("/");
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleProfileOpen}>Profile</MenuItem>
      {/* <MenuItem onClick={handleMenuClose}>My account</MenuItem> */}
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            className={classes.title}
            variant="h6"
            noWrap
            onClick={() => {
              setSearchQuery("");
              navigate("/news-feed");
            }}
          >
            Facebook-Clone
          </Typography>
          <Search
            handleSearch={handleSearch}
            searchResults={!searchResults ? [] : searchResults}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton
              aria-label="show 4 new mails"
              color="inherit"
              onClick={handleProfileOpen}
            >
              {profilePicture ? (
                <Avatar alt={profilePicture.name} src={profilePicture.url} />
              ) : (
                <Avatar>{getInitials(name)}</Avatar>
              )}
              <Typography variant="h6" className={classes.userName}>
                {user && user.firstName}
              </Typography>
            </IconButton>
            {/* <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton> */}
            <IconButton aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={friendRequest.length} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
};

export default NavBar;
