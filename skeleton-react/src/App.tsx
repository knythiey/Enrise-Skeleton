import { useState, useLayoutEffect, useMemo, useCallback } from 'react';
import { SnackbarProvider } from 'notistack';
import Loader from './components/templates/loader/Loader';
import Main from './components/templates/layout/Main';
import { checkIfLoggedIn } from './services/AuthService';
import { getUser } from './services/UserService';

import { AppContext } from 'hooks/contexts/AppContext';
import { createTheme, ThemeProvider } from '@mui/material';

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState<any>([]);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#00c2b2',
        contrastText: '#fff',
      },
      warning: {
        main: '#ff4f00',
      },
      info: {
        main: '#222222',
      },
    },
    typography: {
      fontFamily: [
        'Avenir',
        '"Helvetica Neue"',
        '"Yu Gothic"',
        '"Hiragino Sans"',
        '"ヒラギノ角ゴ Pro W3"',
        '"Hiragino Kaku Gothic Pro"',
        '"メイリオ"',
        'Meiryo',
        'Osaka',
        '"ＭＳ Ｐゴシック"',
        '"MS PGothic"',
        'sans-serif',
      ].join(','),
      htmlFontSize: 10,
    },
  });

  const refreshUser = useCallback(async () => {
    return setUser(await getUser());
  }, [setUser]);

  // Memoize value for context provider
  const providerValue = useMemo(
    () => ({
      isInitialized,
      setIsInitialized,
      isLoggedIn,
      setIsLoggedIn,
      user,
      setUser,
      refreshUser,
      isDrawerOpen,
      setIsDrawerOpen,
    }),
    [
      isInitialized,
      setIsInitialized,
      isLoggedIn,
      setIsLoggedIn,
      user,
      setUser,
      isDrawerOpen,
      setIsDrawerOpen,
    ]
  );

  useLayoutEffect(() => {
    const checkLoggedIn = async () => {
      try {
        //add check if token exists in local storage
        const checkIfLoggedInResponse = await checkIfLoggedIn();
        await refreshUser();
        if (checkIfLoggedInResponse) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
        setIsInitialized(true);
      } catch (err) {
        setIsLoggedIn(false);
        setIsInitialized(true);
      }
    };
    checkLoggedIn();
  }, []);

  return (
    <AppContext.Provider value={providerValue}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          dense
          maxSnack={3}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          {isInitialized ? <Main /> : <Loader />}
        </SnackbarProvider>
      </ThemeProvider>
    </AppContext.Provider>
  );
}
