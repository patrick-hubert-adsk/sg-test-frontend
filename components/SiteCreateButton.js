import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 330,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function SiteCreateButton({branchData}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [siteName, setSiteName] = React.useState('');
  const [branchName, setBranchName] = React.useState('');

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
        siteName: siteName,
        branch: branchName
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
            value={siteName}
            onChange={e => setSiteName(e.currentTarget.value)}
        />
          <FormControl className={classes.formControl} fullWidth>
            <InputLabel id="branch">Branch</InputLabel>
            <Select
              labelId="branch"
              value={branchName}
              onChange={e => setBranchName(e.target.value)}
            >
              {branchData.branches.map(branch => <MenuItem key={branch} value={branch}>{branch}</MenuItem>)}
            </Select>
          </FormControl>
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
