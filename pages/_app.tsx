import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Authenticator, withAuthenticator } from "@aws-amplify/ui-react";
import awsExports from "../src/aws-exports.js";
import { Auth } from "aws-amplify";
import { Amplify } from "aws-amplify";
import { Storage } from "@aws-amplify/storage";
import { Logger } from "aws-amplify";

//Logger.LOG_LEVEL = "DEBUG";

Amplify.configure(awsExports);
Auth.configure(awsExports);
Storage.configure(awsExports);

function App({ Component, pageProps }: AppProps) {
  return (
    <Authenticator loginMechanisms={["email"]}>
      <Component {...pageProps} />
    </Authenticator>
  );
}

export default App;
/* export default withAuthenticator(App); */
