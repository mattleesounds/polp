import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Authenticator, withAuthenticator } from "@aws-amplify/ui-react";

function App({ Component, pageProps }: AppProps) {
  return (
    //<Authenticator.Provider>
    <Component {...pageProps} />
    //</Authenticator.Provider>
  );
}

export default withAuthenticator(App);
