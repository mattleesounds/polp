import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Authenticator, withAuthenticator } from "@aws-amplify/ui-react";
import awsExports from "../src/aws-exports";
import { Auth } from "aws-amplify";
import { Amplify } from "aws-amplify";
import { Storage } from "@aws-amplify/storage";

Amplify.configure(awsExports);
Auth.configure(awsExports);
Storage.configure(awsExports);

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default withAuthenticator(App);
