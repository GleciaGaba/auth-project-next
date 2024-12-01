// pages/_app.js
import React from "react";
import { Provider } from "react-redux";
import store from "../redux/store";
import "../styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap"
        />
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
