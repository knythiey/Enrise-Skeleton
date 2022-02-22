import { Container, CssBaseline, Typography, Paper } from '@mui/material';
import { useCallback, useState } from 'react';
import { createStyles, makeStyles } from '@mui/styles';
import RegisterForm from "../organisms/registration/RegisterForm";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    },
    paper: {
      textAlign: 'center',
    }
  })
);

export default function Register(props: any) {
  const classes = useStyles();
  // value
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailConfirmation, setEmailConfirmation] = useState('');
  const [sex, setSex] = useState('');
  const [birthday, setBirthday] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  //handle any changes in form data
  const handleFormChange = useCallback( (field: String, value: any) => {
    switch (field) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'emailConfirmation':
        setEmailConfirmation(value);
        break;
      case 'sex':
        setSex(value);
        break;
      case 'birthday':
        setBirthday(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'passwordConfirmation':
        setPasswordConfirmation(value);
        break;
    }
  }, [name, email, emailConfirmation, sex, birthday, password, passwordConfirmation]);

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline>
        <div className={classes.root}>
          <Paper className={classes.paper}
            sx={{ my: 4, p: 4 }}>
            <Typography component="h1" variant="h5">
              アカウント登録
            </Typography>
            <RegisterForm
              handleFormChange={handleFormChange}
              data={{
                name: name,
                email: email,
                emailConfirmation: emailConfirmation,
                sex: sex, birthday: birthday,
                password: password,
                passwordConfirmation: passwordConfirmation
              }} />
          </Paper>
        </div>
      </CssBaseline>
    </Container >
  );
}