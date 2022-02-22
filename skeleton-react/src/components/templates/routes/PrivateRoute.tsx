
import clsx from "clsx";
import { Route, Redirect } from "react-router-dom";
import { useMemo } from 'react';
import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
import { useAppContext } from 'hooks/contexts/AppContext';
// import { checkSubscription } from "mixins/CustomFunctions";
import { DrawerWidth } from 'constants/Layouts';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: 1300,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      zIndex: 1300,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
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
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: "flex-end",
    },
    mainContent: {
      margin: "auto",
    },
    content: {
      position: "relative",
      flexGrow: 1,
      padding: 50,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: 0,
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: +DrawerWidth,
    },
    copyrightWrap: {
      margin: " 0 auto",
      backgroundColor: "white",
      display: "flex",
      webkitBoxPack: "justify",
      msFlexPack: "justify",
      justifyContent: "space-between",
      webkitBoxAlign: "center",
      msFlexAlign: "center",
      alignItems: "center",
      padding: "50px 50px 60px 50px",
      "& small": {
        marginLeft: "auto",
        color: "#808080",
        fontSize: "0.8em",
        fontWeight: 300,
        textAlign: "right",
        lineHeight: "1.0em",
      },
    },
  })
);

// Accessible only to logged in users - Example: Login Page

const PrivateRoute = ({
  component: Component,
  routeName,
  ...rest
}: any) => {
  const classes = useStyles();
  const { user, isDrawerOpen, isLoggedIn } = useAppContext();
  const membershipType = user !== null ? user.membership_type : false;
  const isStudent = membershipType <= 1;

  const adminPages = [
    "account_management",
    "affiliations_departments_management",
    "category_management",
    "course_management",
    "notices",
    "course_details",
    "conditional_mail_management",
    "signature_management",
    "organize_mail_management",
    "notice_management",
  ];

  const corporatePages = [
    "account_management",
    "departments_management",
    "unsubscribe",
    "category_management",
    "course_management",
    "notices",
    "course_details",
    "conditional_mail_management",
    "signature_management",
    "organize_mail_management",
    "notice_management",
  ];

  const studentPages = [
    "unsubscribe",
    "change_plan",
    "option_for_apply",
    "course",
    "course_history",
    "course_screen",
    "course_chapter_test_answer",
    "course_chapter_test_results",
    "course_explainer_video",
  ];

  const publicPages = ["profile", "home", "contact_us"];

  const unsubscribedStudentPages = ["course", "course_history"];

  const hasPageRights = useMemo(() => {
    // let res = false;
    let res = true;

    // if (routeName !== "") {
    //   switch (membershipType) {
    //     case 3: {
    //       if (adminPages.includes(routeName) || publicPages.includes(routeName))
    //         res = true;
    //       break;
    //     }

    //     case 2: {
    //       if (
    //         corporatePages.includes(routeName) ||
    //         publicPages.includes(routeName)
    //       )
    //         res = true;
    //       break;
    //     }

    //     case 1:
    //       if (!checkSubscription()) {
    //         if (
    //           unsubscribedStudentPages.includes(routeName) ||
    //           publicPages.includes(routeName)
    //         )
    //           res = true;
    //       } else {
    //         if (
    //           studentPages.includes(routeName) ||
    //           publicPages.includes(routeName)
    //         )
    //           res = true;
    //       }
    //       break;

    //     case 0:
    //     default: {
    //       if (membershipType === 0 && routeName === "unsubscribe") res = false;
    //       else if (
    //         studentPages.includes(routeName) ||
    //         publicPages.includes(routeName)
    //       )
    //         res = true;
    //       break;
    //     }
    //   }
    // }

    return res;
  }, [routeName]);

  return (
    <div style={{ marginTop: isStudent ? 0 : 70 }}>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: isStudent ? false : isDrawerOpen,
        })}
      >
        <Route
          {...rest}
          render={(props) =>
            isLoggedIn ? (
              hasPageRights ? (
                <div className={classes.mainContent}>
                  <Component {...props} {...rest} isLoggedIn />
                </div>
              ) : (
                <Redirect to="/" />
              )
            ) : (
              <Redirect to="/login" />
            )
          }
        />
      </main>
      <footer>
        <div className={classes.copyrightWrap}>
          <small>© 2021 ITCE</small>
        </div>
      </footer>
    </div>
  );
};

export default PrivateRoute;
