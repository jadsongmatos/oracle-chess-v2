import Head from "next/head";
//import Image from 'next/image'
import dynamic from "next/dynamic";

import { useCallback, useEffect, useRef, useState } from "react";

const Chessground = dynamic(() => import("react-chessground"), { ssr: false });

export default function Home() {
  const [nThreads, setNThreads] = useState(1);
  useEffect(() => {
    setNThreads(window.navigator.hardwareConcurrency);
  }, []);
  return (
    <>
      <Head>
        <meta name="description" content="Jogo de xadrez" />
        <link rel="icon" href="/favicon.ico" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <meta name="description" content="Jogo de xadrez" />
        <meta
          property="og:url"
          content="https://github.com/jadsongmatos/oracle-chess"
        />
        <meta property="og:site_name" content="Oracle Chess" />
        <meta property="og:title" content="Oracle Chess" />
        <meta property="og:image" content="/favicon.ico" />
        <meta property="og:description" content="Oracle Chess" />
        <meta property="og:type" content="website" />
        <meta name="twitter:site_name" content="Oracle Chess" />
        <meta name="twitter:title" content="Oracle Chess" />
        <meta name="twitter:card" content="Jogo de xadrez" />
        <meta name="twitter:description" content="Oracle Chess" />
        <meta name="twitter:image" content="/favicon.ico" />
        <meta name="image" content="/favicon.ico" />
        <title>Oracle Chess</title>
      </Head>
      <main className="mt-5 py-5">
        <section className="container mb-5 text-center">
          <h1>Oracle Chess</h1>
        </section>
        <section className="container my-5">{nThreads}</section>
      </main>
    </>
  );
}
