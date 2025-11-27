import Head from "next/head";
import React from "react";
import { connectDatabase } from "../helpers/db-util";
import Raport from "../models/Raport";
import mongoose from "mongoose";
import Results from "../components/results/results";

function decryptParsedJSONArray(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map((item) => {
    if (typeof item !== "string") return item;
    try {
      const jsonStr = Buffer.from(item, "base64").toString("utf8");
      return JSON.parse(jsonStr);
    } catch (e) {
      return item;
    }
  });
}

function decryptRaportSensitiveDate(raport) {
  const sd = raport.sensitiveDate || {};

  return {
    ...raport,
    sensitiveDate: {
      ...sd,
      containsPersonalData: {
        ...(sd.containsPersonalData || {}),
        parsedJSON: decryptParsedJSONArray(sd.containsPersonalData?.parsedJSON),
      },
      containsEmailData: {
        ...(sd.containsEmailData || {}),
        parsedJSON: decryptParsedJSONArray(sd.containsEmailData?.parsedJSON),
      },
      containsTelephoneData: {
        ...(sd.containsTelephoneData || {}),
        parsedJSON: decryptParsedJSONArray(
          sd.containsTelephoneData?.parsedJSON
        ),
      },
      containsLocalizationData: {
        ...(sd.containsLocalizationData || {}),
        parsedJSON: decryptParsedJSONArray(
          sd.containsLocalizationData?.parsedJSON
        ),
      },
      containsBankingData: {
        ...(sd.containsBankingData || {}),
        parsedJSON: decryptParsedJSONArray(sd.containsBankingData?.parsedJSON),
      },
      containsPassData: {
        ...(sd.containsPassData || {}),
        parsedJSON: decryptParsedJSONArray(sd.containsPassData?.parsedJSON),
      },
    },
  };
}

function Wyniki(props) {
  return (
    <React.Fragment>
      <div>
        <Head>
          <title>Wyniki Raportów</title>
          <meta name="description" content="Lista zapisanych raportów" />
        </Head>
        <Results raports={props.raports} />
      </div>
    </React.Fragment>
  );
}

export async function getServerSideProps() {
  try {
    await connectDatabase();
  } catch (error) {
    return { notFound: true };
  }

  try {
    const result = await Raport.find({}).lean();
    mongoose.connection.close();

    const decrypted = result.map((raport) =>
      decryptRaportSensitiveDate(raport)
    );

    return {
      props: {
        raports: JSON.parse(JSON.stringify(decrypted)),
      },
    };
  } catch (error) {
    mongoose.connection.close();
    return { notFound: true };
  }
}

export default Wyniki;
