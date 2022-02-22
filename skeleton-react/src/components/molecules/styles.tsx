import {makeStyles} from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 170,
    width: "100%",
    maxWidth: 220,
  },
  paddingTopHalfRem: {
    paddingTop: ".5rem"
  },
  errorMessage: {
    color: 'red',
    marginTop: '5px',
    marginBottom: '5px',
  }
}));