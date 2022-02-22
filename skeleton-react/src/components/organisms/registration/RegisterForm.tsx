import { useState, useEffect, useCallback } from "react";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import clsx from "clsx";
import { useDropzone } from "react-dropzone";
import { register, getUserFromApi } from "../../../services/UserService";
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';
import { Visibility, VisibilityOff, AccountCircle } from '@mui/icons-material';
import { Grid, IconButton, OutlinedInput, InputLabel, InputAdornment, Select, CircularProgress, TextField, Button, FormControl, FormHelperText } from "@mui/material";
import { AutoHideDuration } from 'constants/Snackbars';
import ErrorHandler from "mixins/ErrorHandler";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexDirection: "column",
      alignItems: "center",
    },
    form: {
      width: "100%",
    },
    textField: {
    },
    formControlMargin: {
    },
    button: {
    },
    errorMessage: {
      color: "red",
      textAlign: "center",
    },
    profilePicture: {},
    thumbsContainer: {
      display: "flex",
      marginTop: 16,
    },
    thumb: {
      display: "inline-flex",
      marginBottom: 8,
      marginRight: 8,
      cursor: "pointer",
    },
    thumbInner: {
      display: "flex",
      minWidth: 0,
      overflow: "hidden",
      width: "10rem",
      height: "10rem",
      borderRadius: 100,
    },
    img: {
      minWidth: "100%",
      minHeight: "100%",
      objectFit: "cover",
    },
    paper: {
      textAlign: "center",
    },
  })
);

export default function RegisterForm(props: any) {
  const history = useHistory();
  const handleFormChange = props.handleFormChange;
  const {
    name,
    email,
    emailConfirmation,
    sex,
    birthday,
    password,
    passwordConfirmation,
  } = props.data;
  const [errors, setErrors] = useState(new ErrorHandler({}));
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const { setLoggedIn, refreshUser, handleCloseProp } = props;
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const profilePic = {
    border: "2px solid black",
    width: "10rem",
    height: "10rem",
    borderRadius: "50%",
    margin: "auto",
    marginTop: "30px",
    marginBottom: "30px",
    overflow: "hidden",
    cursor: "pointer",
  };

  //prof pic
  const [image, setImage] = useState<any[]>([]);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    minSize: 0,
    maxSize: 5242880,
    onDrop: (acceptedFiles) => {
      setImage(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const thumbs = image.map((file) => (
    <div className={classes.thumb} key={file.preview}>
      <div className={classes.thumbInner}>
        <img src={file.preview} alt={file.name} className={classes.img} />
      </div>
    </div>
  ));

  const addNotification = (message: string, type: any) => {
    enqueueSnackbar(message, { variant: type, autoHideDuration: AutoHideDuration });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowPasswordConfirmation = () => {
    setShowPasswordConfirmation(!showPasswordConfirmation);
  };

  const handleMouseDownPasswordConfirmation = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleRegister = useCallback(async (event: any) => {
    errors.reset();
    event.preventDefault();
    try {
      event.preventDefault();
      if (!isRegistering) {
        setIsRegistering(true);

        let formdata = new FormData();
        formdata.append("name", name);
        formdata.append("email", email);
        formdata.append("email_confirmation", emailConfirmation);
        formdata.append("sex", sex);
        formdata.append("birthday", birthday);
        formdata.append("password", password);
        formdata.append("password_confirmation", passwordConfirmation);

        if (acceptedFiles.length) {
          formdata.append("image", acceptedFiles[0]);
        }

        const response = await register(formdata, true);

        if (response.status === 200) {
          addNotification(`登録に成功`, "success");
          setIsRegistering(false);
          errors.reset();
          //automatically log in user after registering
          if (refreshUser) {
            const userResponse = await getUserFromApi();
            if (userResponse.status === 200) {
              await refreshUser();
              addNotification(
                `techhubへようこそ ${userResponse.data.user.name}`,
                "success"
              );
              setLoggedIn(true);
            }
          } else {
            // External handle when reused by other modules
            handleClose();
          }
        }
        return response;
      }
    } catch (err: any) {
      setIsRegistering(false);
      if (err.response) {
        setErrors(new ErrorHandler(err.response.data.errors));
        addNotification("Registration failed.", "error");
      }
    }
  }, [name, email, emailConfirmation, sex, birthday, password, passwordConfirmation]);

  // Handle Back
  const handleClose = () => {
    // Default action
    history.push("/login");
  };

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      image.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [image]
  );

  return (
    <div className={classes.root}>
      <form
        className={classes.form}
        onSubmit={handleRegister}
        encType="multipart/form-data"
      >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
          sx={{ p: 2 }}
        >
          <Grid item xs={12} sm={4}>
            <section>
              <div
                style={profilePic}
                {...getRootProps({ className: "dropzone" })}
              >
                <input {...getInputProps()} />
                {thumbs}
                <AccountCircle className={classes.img} />
              </div>
            </section>
          </Grid>
          <Grid item xs={12} sm={8}>
            {/* name */}
            <div className={classes.textField}>
              <TextField
                id="name"
                name="name"
                label="名前"
                variant="outlined"
                margin="normal"
                value={name}
                onChange={(e: any) => {
                  handleFormChange("name", e.target.value);
                }}
                fullWidth
                required
                error={errors.hasKey("name")}
                helperText={errors.getKey("name")}
              />
            </div>

            {/* mail address */}
            <div>
              <TextField
                id="email"
                name="email"
                label="メールアドレス"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e: any) => {
                  handleFormChange("email", e.target.value);
                }}
                fullWidth
                required
                type="email"
                error={errors.hasKey("email")}
                helperText={errors.getKey("email")}
              />
            </div>

            {/* mail address confirmation */}
            <div>
              <TextField
                id="email_confirmation"
                name="email_confirmation"
                label="メールアドレス（確認）"
                variant="outlined"
                margin="normal"
                sx={{ my: 1.5 }}
                value={emailConfirmation}
                onChange={(e: any) => {
                  handleFormChange("emailConfirmation", e.target.value);
                }}
                fullWidth
                // required
                type="email"
                error={errors.hasKey("email_confirmation")}
                helperText={errors.getKey("email_confirmation")}
              />
            </div>

            {/* gender */}
            <div>
              <FormControl
                className={classes.formControlMargin}
                variant="outlined"
                fullWidth
                sx={{ my: 1.5 }}
                error={errors.hasKey("birthday")}
              >
                <InputLabel htmlFor="outlined-age-native-simple">
                  性別
                </InputLabel>
                <Select
                  native
                  name="sex"
                  value={sex}
                  onChange={(e: any) => {
                    handleFormChange("sex", e.target.value);
                  }}
                  label="性別"
                  variant="outlined"
                  fullWidth
                  inputProps={{
                    name: "性別 ",
                    id: "outlined-age-native-simple",
                  }}
                  error={errors.getKey("sex") !== null}
                >
                  <option value={0}>未回答</option>
                  <option value={1}>男性</option>
                  <option value={2}>女性</option>
                </Select>
                <FormHelperText>{errors.getKey("sex")}</FormHelperText>
              </FormControl>
            </div>

            {/* birthday */}
            <div>
              <TextField
                id="birthday"
                name="birthday"
                label="生年月日"
                type="date"
                variant="outlined"
                margin="normal"
                sx={{ my: 1.5 }}
                value={birthday}
                onChange={(e: any) => {
                  handleFormChange("birthday", e.target.value);
                }}
                className={classes.textField}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                error={errors.getKey("birthday") !== null}
                helperText={errors.getKey("birthday")}
              />
            </div>

            {/* password */}
            <div>
              <FormControl
                className={clsx(classes.formControlMargin)}
                variant="outlined"
                fullWidth
                sx={{ my: 1.5 }}
                error={errors.hasKey("password")}
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  パスワード
                </InputLabel>
                <OutlinedInput
                  id="password"
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e: any) => {
                    handleFormChange("password", e.target.value);
                  }}
                  error={errors.hasKey("password")}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                // labelWidth={75}
                />
                <FormHelperText color="secondary">
                  {errors.getKey("password")}
                </FormHelperText>
              </FormControl>
            </div>

            {/* password confirmation */}
            <div>
              <FormControl
                className={clsx(classes.formControlMargin)}
                variant="outlined"
                sx={{ my: 1.5 }}
                fullWidth
                error={errors.getKey("password_confirmation") !== null}
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  パスワード（確)
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  name="password_confirmation"
                  fullWidth
                  type={showPasswordConfirmation ? "text" : "password"}
                  value={passwordConfirmation}
                  onChange={(e: any) => {
                    handleFormChange("passwordConfirmation", e.target.value);
                  }}
                  error={errors.getKey("password_confirmation") !== null}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleShowPasswordConfirmation}
                        onMouseDown={handleMouseDownPasswordConfirmation}
                      >
                        {showPasswordConfirmation ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                // labelWidth={75}
                />
                <FormHelperText>
                  {errors.getKey("password_confirmation")}
                </FormHelperText>
              </FormControl>
            </div>

            <Grid sx={{ my: 1, mb: 2 }} container spacing={2} className={classes.formControlMargin}>
              <Grid item xs={6}>
                <Button
                  onClick={handleClose}
                  variant="contained"
                  color="secondary"
                  fullWidth
                  className={classes.button}
                >
                  戻る
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  disabled={isRegistering}
                  fullWidth
                  className={classes.button}
                >
                  {isRegistering ? <CircularProgress size={24} /> : "登録"}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
