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

    const handleCreate = (thisForm) => {
      fetch('/api/createTestSite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          siteName: document.getElementById("site_name").value,
          branch: document.getElementById("branch").value
        })
      });
      setOpen(false);
    };

    const handleCancel = () => {
      setOpen(false);
    };

    return (
      <div>
        <button onClick={handleClickOpen} style={{backgroundColor: 'white', border: 0, padding: 0}}>
          <img src="/static/images/buttons/create2.png" alt="Create a New Test Site" width="200" height="55" />
        </button>
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
            <button onClick={handleCancel} style={{backgroundColor: 'white', border: 0, padding: 0}}>
              <img src="/static/images/buttons/cancel.png" alt="Cancel" width="100" height="46" />
            </button>
            <button onClick={handleCreate} style={{backgroundColor: 'white', border: 0, padding: 0}}>
              <img src="/static/images/buttons/create.png" alt="Create New Site" width="175" height="46" />
            </button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
