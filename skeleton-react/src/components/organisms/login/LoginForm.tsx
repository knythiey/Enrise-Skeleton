import { useState, useCallback } from "react";
import { createStyles, makeStyles } from '@mui/styles';
import { Button, Typography, TextField, CircularProgress } from "@mui/material";
import { login } from "services/AuthService";
import { useSnackbar } from 'notistack';
import { useAppContext } from 'hooks/contexts/AppContext';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    form: {
      width: '100%',
    },
    textField: {
    },
    submitButton: {
      backgroundColor: '#00B4AA',
      color: 'white',
      width: '100%',
      '&:hover': {
        color: "#00B4AA",
      },
    },
    linkButton: {
      color: '#00B4AA',
    },
    errorMessage: {
      color: 'red',
      textAlign: 'center',
    }
  }));

export default function LoginForm(props: any) {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { setIsLoggedIn, refreshUser } = useAppContext();
  const { enqueueSnackbar } = useSnackbar();

  const addNotification = (message: string, type: any) => {
    enqueueSnackbar(message, { variant: type, autoHideDuration: 4000 });
  };

  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  const handleLogin = useCallback(async (event: any) => {
    try {
      event.preventDefault();
      if (isLoggingIn) {
        return;
      }

      setIsLoggingIn(true);
      setErrorMessage('');

      const response = await login({
        email: email,
        password: password
      });
      if (response.status === 200) {
        addNotification(`techhubへようこそ ${response.data.user.name}`, 'success');
        setIsLoggingIn(false);
        await refreshUser();
        setIsLoggedIn(true);
      }
    } catch (err) {
      setErrorMessage('ログインIDまたはパスワードが違います。');
      addNotification('ログインIDまたはパスワードが違います。', 'error');
      setIsLoggingIn(false);
    }
  }, [email, password]);

  return (
    <div className={classes.root}>
      <form className={classes.form} onSubmit={handleLogin}>
        <div className={classes.textField}>
          <TextField
            id="email"
            label="メールアドレス"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={handleEmailChange}
            required
            fullWidth />
        </div>
        <div className={classes.textField}>
          <TextField
            id="password"
            label="パスワード"
            type="password"
            autoComplete="current-password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={handlePasswordChange}
            required
            fullWidth
          />
        </div>
        {errorMessage &&
          <Typography component="p" variant="caption" className={classes.errorMessage}>
            {errorMessage}
          </Typography>
        }
        <Button
          variant="contained"
          disabled={isLoggingIn}
          type="submit"
          className={classes.submitButton}
          sx={{ my: 2 }}
        >
          {isLoggingIn ? <CircularProgress size={24} /> : 'ログイン'}
        </Button>
      </form>
    </div>
  );
}