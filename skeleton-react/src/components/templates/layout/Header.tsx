import React, { useState } from "react";
import clsx from "clsx";
import { Theme } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import { IconButton, Link, Menu, AppBar, Avatar, Divider, Toolbar, MenuItem, Typography, ListItemIcon, ListItemText } from "@mui/material";
import { AccountCircle, ExitToApp, Edit, Eject, Contacts } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { deepOrange } from "@mui/material/colors";
import { logout } from "services/AuthService";
import { getPublicImage } from "services/ApiService";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import ConfirmationDialog from "components/molecules/confirmationDialog/ConfirmationDialog";
import { cancelUnsubscribe } from "services/UserService";
import { AutoHideDuration } from "constants/Snackbars";
import { useAppContext } from 'hooks/contexts/AppContext';
import { DrawerWidth } from 'constants/Layouts';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      zIndex: 1300,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      [theme.breakpoints.up("sm")]: {
        flexShrink: 0,
      },
    },
    appBarShift: {
      zIndex: 1300,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: DrawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: DrawerWidth,
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: "flex-end",
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -DrawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    title: {
      flexGrow: 1,
    },
    titleLink: {
      cursor: "pointer",
      color: "white",
      "&:hover": {
        color: "white",
      },
    },
    menu: {
      marginTop: theme.spacing(5),
    },
    orange: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
    },
    small: {
      width: theme.spacing(4),
      height: theme.spacing(4),
      marginLeft: "-3px",
    },
  })
);

export default function Header(props: any) {
  const classes = useStyles();
  const history = useHistory();
  const { setIsLoggedIn, user, refreshUser, isDrawerOpen, setIsDrawerOpen } = useAppContext();
  // const { open, user, setLoggedIn, handleDrawerClick, refreshUser } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openConfirmUnsubscribe, setOpenConfirmUnsubscribe] = useState(false);
  const [disabledUnsubscribe, setDisableUnsubscribe] = useState(false);

  const addNotification = (message: string, type: any) => {
    enqueueSnackbar(message, { variant: type, autoHideDuration: AutoHideDuration });
  };

  const handleUnsubscribe = () => {
    history.push("/unsubscribe");
    handleClose();
  };

  const handleContact = () => history.push("/contact");

  const handleLogout = async (event: any) => {
    try {
      if (isLoggingOut) {
        return;
      }

      event.preventDefault();
      setIsLoggingOut(true);
      const response = await logout();
      setIsLoggingOut(false);
      if (response.status === 200) {
        addNotification(`正常にログアウトしました。すてきな一日を`, "info");
        setIsLoggedIn(false);
      }
    } catch (err: any) {
      addNotification(err.message, "error");
    }
  };

  const handleAccount = () => {
    history.push("/profile");
    handleClose();
  };

  const handleEditAccount = () => {
    history.push("/profile/edit");
    handleClose();
  };

  const handleCancelUnsubscribe = async () => {
    setDisableUnsubscribe(true);
    try {
      const response = await cancelUnsubscribe();
      if (response.status === 200) {
        setDisableUnsubscribe(false);
        setOpenConfirmUnsubscribe(false);
        addNotification(
          "You have successfully cancelled your unsubscription.",
          "success"
        );
        refreshUser();
      }
    } catch (err: any) {
      if (err.response) {
        addNotification(err.message, "error");
        setDisableUnsubscribe(false);
      }
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: isDrawerOpen,
      })}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          edge="start"
          className={clsx(classes.menuButton)}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          <Link
            onClick={() => {
              history.push("/");
            }}
            className={classes.titleLink}
            color="inherit"
          >
            Techhub
          </Link>
        </Typography>
        <IconButton edge="end" onClick={handleClick}>
          {user.image ? (
            <Avatar
              alt={user.name}
              src={getPublicImage(user.image)}
              className={classes.small}
            />
          ) : (
            <AccountCircle style={{ color: "white" }} />
          )}
        </IconButton>
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          className={classes.menu}
        >
          <MenuItem onClick={handleAccount}>
            <ListItemIcon>
              {user.image ? (
                <Avatar alt={user.name} src={getPublicImage(user.image)} />
              ) : (
                <Avatar className={classes.orange} />
              )}
            </ListItemIcon>
            <ListItemText primary={user.name} secondary={user.email} />
          </MenuItem>
          <Divider />
          {user.membership_type < 2 && (
            <MenuItem
              style={{ margin: "10px 0px" }}
              onClick={handleEditAccount}
            >
              <ListItemIcon>
                <Edit />
              </ListItemIcon>
              アカウントを編集
            </MenuItem>
          )}
          <MenuItem style={{ margin: "10px 0px" }} onClick={handleContact}>
            <ListItemIcon>
              <Contacts />
            </ListItemIcon>
            お問い合わせ
          </MenuItem>
          {(!user.withdrawn_flag || user.withdrawn_flag === 0) && user.membership_type < 3 && (
            <div>
              <Divider />
              <MenuItem
                style={{ margin: "10px 0px" }}
                onClick={handleUnsubscribe}
              >
                <ListItemIcon>
                  <Eject />
                </ListItemIcon>
                退会
              </MenuItem>
            </div>
          )}
          {(user.withdrawn_flag || user.withdrawn_flag === 1) && user.membership_type < 3 && (
            <div>
              <Divider />
              <MenuItem
                style={{ margin: "10px 0px" }}
                onClick={() => setOpenConfirmUnsubscribe(true)}
              >
                <ListItemIcon>
                  <Eject />
                </ListItemIcon>
                登録解除のキャンセル
              </MenuItem>
            </div>
          )}
          <Divider />
          <MenuItem
            style={{ color: "red", marginTop: "10px" }}
            onClick={handleLogout}
          >
            <ListItemIcon style={{ color: "red" }}>
              <ExitToApp />
            </ListItemIcon>
            ログアウト
          </MenuItem>
        </Menu>
      </Toolbar>

      <ConfirmationDialog
        toggleConfirmDialog={setOpenConfirmUnsubscribe}
        isConfirmDialog={openConfirmUnsubscribe}
        isConfirmButtonDisabled={disabledUnsubscribe}
        title="Cancel unsubscribe"
        message="Do you want to cancel unsubscribing?"
        cancelText="Cancel"
        confirmText="Confirm"
        confirmTextColor="secondary"
        confirmAction={handleCancelUnsubscribe}
      />
    </AppBar>
  );
}
