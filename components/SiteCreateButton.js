import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function SiteCreateButton() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    // siteName: document.getElementById("site_name").value,
    // branch: document.getElementById("branch").value
    const handleCreate = (thisForm) => {
      fetch('/api/createTestSite', {
        method: 'POST',
        body: JSON.stringify({
          siteName: 'abc',
          branch: 'dev'
        })
      });
      setOpen(false);
    };

    const handleCancel = () => {
      setOpen(false);
    };

    return (
      <div>
        <Button variant="contained" onClick={handleClickOpen}>
          Create Test Site
        </Button>
        <Dialog open={open} onClose={handleCancel} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Create Test Site</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Create a new test site
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="site_name"
              label="Site Name"
              type="text"
              fullWidth
            />
            <TextField
              margin="dense"
              id="branch"
              label="Branch"
              type="text"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleCreate} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
