import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import PrivateRoute from 'components/templates/routes/PrivateRoute';
import PublicRoute from 'components/templates/routes/PublicRoute';
import { Home, Login, Register, } from "../../pages";
import { useAppContext } from 'hooks/contexts/AppContext';
import Skeleton from "components/templates/Skeleton";
import { logout } from "services/AuthService";
import { Fade, Typography } from "@mui/material";

export default function App() {
  const { isInitialized, isLoggedIn } = useAppContext();

  return (
    <Router>
      <Fade in={isInitialized}>
        <div>
          {isLoggedIn &&
            <Skeleton />
          }
          <Switch>
            <PublicRoute restricted={true} component={Login} path="/login" exact />
            <PublicRoute restricted={true} component={Register} path="/register" exact />

            <PrivateRoute routeName="logout" component={logMeOut} path="/logout" exact />
            {/* home screen */}
            <PrivateRoute routeName='home' path="/" component={Home} exact
            />
            <PublicRoute routeName='404' path="/" component={Sample404Page}
            />
          </Switch>
        </div>
      </Fade>
    </Router>
  );
}

// You can think of these components as "pages" in your app.
// function SamplePrivateComponent() {
//   return (
//     <div>
//       <h2>Private page</h2>
//       <Typography paragraph>
//         Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
//         facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
//         tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat
//         consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus sed
//         vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in. In
//         hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem et
//         tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique sollicitudin
//         nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo viverra maecenas
//         accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam ultrices sagittis orci a.
//       </Typography>
//     </div>
//   );
// }
function Sample404Page() {
  return (
    <div>
      <h2>404 page</h2>
      <Typography paragraph>
        Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
        facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
        tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat
        consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus sed
        vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in. In
        hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem et
        tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique sollicitudin
        nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo viverra maecenas
        accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam ultrices sagittis orci a.
      </Typography>
    </div>
  );
}

function logMeOut() {
  logout();
  return <Redirect to='/login' />
}
