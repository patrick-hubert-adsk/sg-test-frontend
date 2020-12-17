import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import SiteLaunchButton from './SiteLaunchButton';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function TestStackTable(rows) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
          <TableCell></TableCell>
          <TableCell>Branch</TableCell>
            <TableCell align="left">Creator</TableCell>
            <TableCell align="left">Created</TableCell>
            <TableCell align="left">Actions</TableCell>
            <TableCell align="left"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.StackName}>
              <TableCell component="th" scope="row">
                {SiteLaunchButton(row)}
              </TableCell>
              <TableCell align="left">{row.StackName}</TableCell>
              <TableCell align="left">Unknown</TableCell>
              <TableCell align="left">{row.CreationTime.slice(0, 19)}</TableCell>
              <TableCell align="left">
                <Button variant="contained">Update</Button>
                <Button variant="contained">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}