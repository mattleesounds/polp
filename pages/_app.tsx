import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Authenticator } from "@aws-amplify/ui-react";
import awsExports from "../src/aws-exports.js";
import { Auth } from "aws-amplify";
import { Amplify } from "aws-amplify";
import { Storage } from "@aws-amplify/storage";
import { Logger } from "aws-amplify";
import { useEffect, useState } from "react";
import Link from "next/link";
import SignIn from "@/components/SignIn";
import MediaProvider from "@/components/MediaProvider";
import { ToastContainer } from "react-toastify";

//Logger.LOG_LEVEL = "DEBUG";

Amplify.configure(awsExports);
Auth.configure(awsExports);
Storage.configure(awsExports);

console.log("Redirect Sign In:", process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN);
console.log("Redirect Sign Out:", process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT);

function App({ Component, pageProps }: AppProps) {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if the user is signed in
    Auth.currentAuthenticatedUser()
      .then(() => setIsSignedIn(true))
      .catch(() => setIsSignedIn(false));
  }, []);

  // If the authentication status is not yet determined, render a loading message
  if (isSignedIn === null) {
    return <div>Loading...</div>;
  }

  // If the user is not signed in, render the sign-in page
  if (!isSignedIn) {
    return <SignIn />;
  }
  return (
    <MediaProvider>
      <Authenticator loginMechanisms={["email"]}>
        <Component {...pageProps} />
      </Authenticator>
      <ToastContainer />
    </MediaProvider>
  );
}

export default App;
/* export default withAuthenticator(App); */
