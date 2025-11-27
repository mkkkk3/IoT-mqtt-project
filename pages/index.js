import Head from "next/head";
import React from "react";
import Homepage from "../components/home-page/homepage";

function HomePage(props) {
  return (
    <React.Fragment>
      <div>
        <Head>
          <title>Restty</title>
          <meta
            name="description"
            content="Welcome to the Restty. Here, you can find remarkable places. Share your discoveries and explore"
          />
        </Head>
        <Homepage />
      </div>
    </React.Fragment>
  );
}

export default HomePage;
