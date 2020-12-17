import Head from 'next/head'
import styles from '../styles/Home.module.css'

import Amplify, { API } from 'aws-amplify';
import awsconfig from '../src/aws-exports';

import Navbar from "./components/Navbar"

import ButtonBases from '../components/Button/index.jsx'

Amplify.configure(awsconfig);

function getGitData() {
  const apiName = 'sgtestapi';
  const path = '/git';
  const myInit = { // OPTIONAL
    headers: {}, // OPTIONAL
  };

  return API.get(apiName, path, myInit);
}

function getSiteData() {
  const apiName = 'sgtestapi';
  const path = '/site';
  const myInit = { // OPTIONAL
    headers: {}, // OPTIONAL
  };

  return API.get(apiName, path, myInit);
}


export async function getServerSideProps() {
  const gitData = await getGitData()
  const siteData = await getSiteData()
  return { props: { gitData, siteData } }
}

// export default function Home({gitData}) {
export default function Home({gitData, siteData}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat:700%7COpen+Sans:300%7CRoboto:100,200,300,400,500,700,900%7CRoboto+Mono%7CMaterial+Icons"/>
      </Head>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>
        {/* Welcome to <a href="https://nextjs.org">{gitData.Patrick}</a> */}
        {/* Welcome to <a href="https://nextjs.org">{gitData.Patrick}</a> */}
        SHOTGUN Cloud Test Stack
        </h1>
        {/* {ButtonBases()} */}
        {/* <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p> */}

        <p></p>
        {BasicTable(siteData)}

      </main>
    </div>
  )
}



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
import { green } from '@material-ui/core/colors';

function getLaunchButton(data) {
  if (data.Outputs) {
    const siteUrl = `https://${data.Outputs[0].OutputValue}`;
    return (
      <Button target='_blank' href={siteUrl} variant="contained">Launch</Button>
    );
  }
}

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows_OLD = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

function BasicTable(rows) {
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
                {getLaunchButton(row)}
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