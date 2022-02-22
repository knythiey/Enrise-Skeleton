import { Route, Redirect } from 'react-router-dom';
import { useAppContext } from 'hooks/contexts/AppContext'

//Restricted(false) -> Accessible to all users - Example: Login Page
//Restricted(true)  -> Accessible to all users that are NOT logged in - Example: Sign In Page


const PublicRoute = ({ component: Component, restricted, ...rest }: any) => {
  const { isLoggedIn } = useAppContext();
  return (
    <Route {...rest} render={props => (
      isLoggedIn && restricted ?
        <Redirect to="/" />
        : <Component {...props} {...rest} isLoggedIn />
    )} />
  );
};

export default PublicRoute;