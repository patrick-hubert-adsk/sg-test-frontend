import Head from 'next/head'
import styles from '../styles/Home.module.css'

import Amplify, { withSSRContext } from 'aws-amplify';

import Navbar from "../components/Navbar"
import TestStackTable from "../components/TestStackTable"
import SiteCreateButton from "../components/SiteCreateButton"

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
        <p><SiteCreateButton /></p>
        {TestStackTable(siteData)}
      </main>
    </div>
  )
}

export async function getServerSideProps(context) {
  const { API } = withSSRContext(context)
  let siteData;
  try{
    siteData = await API.get('sgtestapi', '/site');
    console.log('getSiteData: worked');
  } catch (err) {
    console.log("getSiteData: ", err);
  }

  return { props: { siteData } }
}
