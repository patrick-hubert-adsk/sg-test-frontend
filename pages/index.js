import Head from 'next/head'
import styles from '../styles/Home.module.css'
import GoogleFonts from "next-google-fonts";
import Navbar from "../components/Navbar"
import TestStackTable from "../components/TestStackTable"
import SiteCreateButton from "../components/SiteCreateButton"
import { fetchSites } from './api/site';
import { fetchBranches } from './api/branch';
import useSWR from 'swr';

export default function Home({siteData, branchData}) {
  // console.log({siteData, branchData});
  const { data: siteDataUpdated, mutate: siteMutate } = useSWR(`/api/site`, {
    siteData,
    refreshInterval: 1000 * 20,
    revalidateOnMount: true,
  });
  const { data: branchDataUpdated, mutate: branchMutate } = useSWR(`/api/branch`, {
    branchData,
    refreshInterval: 1000 * 60 * 10,
    revalidateOnFocus: false,
    revalidateOnMount: true,
  });

  if (!branchDataUpdated || !siteDataUpdated) return "loading";
  return (
    <div>
      <GoogleFonts href="https://fonts.googleapis.com/css?family=Montserrat:700%7COpen+Sans:300%7CRoboto:100,200,300,400,500,700,900%7CRoboto+Mono%7CMaterial+Icons&display=swap" />
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>
        SHOTGUN Cloud Test Stack
        </h1>
        <SiteCreateButton branchData={branchDataUpdated} mutate={siteMutate}/>
        <div>
          <TestStackTable
            siteData={siteDataUpdated}
            mutate={siteMutate}
          />
        </div>
      </main>
    </div>
  )
}

export const getStaticProps = async () => {
  const siteData = await fetchSites();
  const branchData = await fetchBranches();
  // console.log({siteData, branchData});
  return {
    props: {
      siteData,
      branchData
    },
    revalidate: 1,
  };
};
