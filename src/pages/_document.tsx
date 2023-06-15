import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="pt">
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
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
