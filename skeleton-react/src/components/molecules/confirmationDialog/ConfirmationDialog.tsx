import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from '@mui/material';

export default function ConfirmationDialog(props: any) {
  const { toggleConfirmDialog, isConfirmDialog, isConfirmButtonDisabled, title, message, cancelText, confirmText, confirmTextColor, confirmAction } = props;

  const handleClose = () => {
    toggleConfirmDialog(false);
  };

  return (
    <Dialog
      open={isConfirmDialog}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {cancelText}
        </Button>
        <Button disabled={isConfirmButtonDisabled} onClick={confirmAction} variant="contained" color={confirmTextColor} autoFocus>
          {isConfirmButtonDisabled ? <CircularProgress size={24} color={confirmTextColor} /> : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}