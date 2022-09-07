import Head from "next/head";
import dynamic from "next/dynamic";
import "../styles/global.css";

const Root = dynamic(() => import("../components/Root"), {
  ssr: false,
});

const App = (props: any) => {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>dApps</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <Root>
        <Component {...pageProps} />
      </Root>
    </>
  );
};

export default App;
