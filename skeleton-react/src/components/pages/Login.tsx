import { useHistory } from "react-router-dom";
import { Grid, CssBaseline, Container, Typography, Button, Link, Paper, Theme } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import LoginForm from "../organisms/login/LoginForm";
import { useAppContext } from 'hooks/contexts/AppContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'block',
      marginTop: theme.spacing(10),
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    },
    miniTitle: {
      marginTop: '0'
    },
    linkButton: {
      marginBottom: theme.spacing(4),
      display: 'block',
      margin: 'auto',
      color: '#00B4AA',
    },
    paper: {
      padding: theme.spacing(4),
      textAlign: 'center',
    }
  }));

export default function Login(props: any) {
  const { setIsLoggedIn, refreshUser } = useAppContext();
  const history = useHistory();
  const classes = useStyles();

  const goToRegisterForm = () => {
    history.push('/register');
  }

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline>
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <Typography component="h1" variant="h5">
              Techhub
            </Typography>
            <p className={classes.miniTitle}>ITインフラエンジニア向け資格対策eラーニング</p>

            <LoginForm setIsLoggedIn={setIsLoggedIn} refreshUser={refreshUser} />

            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="flex-start"
            >
              <Button variant="outlined" className={classes.linkButton}>
                利用規約
              </Button>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="flex-start"
            >
              <Link component="button">
                パスワードをお忘れの方はこちら
              </Link>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="flex-start"
            >
              <Link component="button" onClick={goToRegisterForm}>
                アカウントをお持ちではない方はこちら
              </Link>
            </Grid>
          </Paper>
        </div>
      </CssBaseline>
    </Container>
  )
}