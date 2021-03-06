import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import SiteLaunchButton from './SiteLaunchButton';
import SiteUpdateButton from './SiteUpdateButton';
import SiteDeleteButton from './SiteDeleteButton';
import RefreshButton from './RefreshButton';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function getCreator(tags) {
  let creator = tags.find(obj => {
    return obj.Key === "creator"
  })
  if (creator === undefined) {
    return "Unknown";
  }
  return creator.Value;
}

export default function TestStackTable({siteData, mutate}) {
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
            <TableCell align="left" style={{display: 'flex', justifyContent: 'space-between', paddingRight: '20px'}}>
              <span>Actions</span>
              <RefreshButton mutate={mutate} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {siteData.map((siteDatum) => (
            getCreator(siteDatum.Tags) != "Unknown" &&
            <TableRow key={siteDatum.StackName}>
              <TableCell component="th" scope="row">
                <SiteLaunchButton siteData={siteDatum} />
              </TableCell>
              <TableCell align="left">{siteDatum.StackName.slice(11)}</TableCell>
              <TableCell align="left">{getCreator(siteDatum.Tags)}</TableCell>
              <TableCell align="left">{siteDatum.CreationTime.slice(0, 19)}</TableCell>
              <TableCell align="left">
                <SiteUpdateButton siteData={siteDatum} />
                <SiteDeleteButton siteData={siteDatum} mutate={mutate} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}