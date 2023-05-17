import React from 'react';
import Head from 'next/head'
import Link from 'next/link'
import Script from 'next/script'

export default function Home() {
  return (
    <React.Fragment>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <Link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css" />
        <Link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossOrigin="anonymous" />
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
          crossOrigin="anonymous" />
        <Script src="https://kit.fontawesome.com/de3c559df6.js" crossOrigin="anonymous" />
        <title> App-RivaCold-BC </title>
      </Head>
      <body style={{ display: "block" }}>
        <div>
          <p>
            Testingsssssssssssssssss
          </p>
        </div>
      </body>
    </React.Fragment >
  )
}