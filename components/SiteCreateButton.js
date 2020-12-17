import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


import Amplify, { API } from 'aws-amplify';
import awsconfig from '../src/aws-exports';


Amplify.configure(awsconfig);

function createSite(site_name, branch) {
  const apiName = 'sgtestapi';
  const path = '/site';
  const myInit = {
    body: {app_tag: branch, site_name: site_name}
  };

  return API.post(apiName, path, myInit);
}

export default function SiteCreateButton() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleCreate = (thisForm) => {
      createSite(document.getElementById("site_name").value, document.getElementById("branch").value)
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
