import Head from 'next/head'
import styles from '../styles/Home.module.css'


import Amplify, { API } from 'aws-amplify';
import awsconfig from '../src/aws-exports';

Amplify.configure(awsconfig);

function getSiteData() {
  const apiName = 'sgtestapi';
  const path = '/site';
  const myInit = { // OPTIONAL
    headers: {}, // OPTIONAL
  };

  return API.get(apiName, path, myInit);
}


export async function getServerSideProps() {
  const siteData = await getSiteData()
  return { props: { siteData } }
}

import Navbar from "./components/Navbar"

export default function Home({siteData}) {
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
        SHOTGUN Cloud Test Stack
        </h1>
        {/* {BasicTable(siteData)} */}
      </main>
    </div>
  )
}
