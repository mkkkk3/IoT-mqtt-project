import Head from "next/head";
import React from "react";

export default function Custom404() {
  return (
    <React.Fragment>
      <Head>
        <title>Not Found</title>
      </Head>
      <div className="w-full h-[30rem] bg-page1 md:grid md:grid-cols-12">
        <div className="w-full h-1/2 md:h-full md:col-span-5">
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-page text-2xl sm:text-5xl md:text-4xl lg:text-5xl text-pageMenu font-extrabold tracking-wide text-center overflow-hidden bg-page1 p-5">
              not found...
            </span>
          </div>
        </div>
        <div className="w-full h-1/2 md:h-full md:col-span-7 flex items-center justify-center">
          <div className="w-80 h-40 overflow-hidden flex items-center justify-center">
            <span className="text-9xl font-page font-extrabold text-center text-pageMenu">
              404
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
