import Head from "next/head";
import "../styles/globals.css";
import Layout from "../components/layout/layout";
import { NotificationContextProvider } from "../store/notification-context";
import React from "react";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <NotificationContextProvider>
        <Layout>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </Head>
          <Component {...pageProps} />
        </Layout>
      </NotificationContextProvider>
    </SessionProvider>
  );
}

export default MyApp;
