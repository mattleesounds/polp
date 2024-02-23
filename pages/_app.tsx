import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Logger } from "aws-amplify";
import { useEffect, useState } from "react";
import Link from "next/link";
import SignIn from "@/components/SignIn";
import MediaProvider from "@/components/MediaProvider";
import { ToastContainer } from "react-toastify";

//Logger.LOG_LEVEL = "DEBUG";
function App({ Component, pageProps }: AppProps) {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);

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
      <Component {...pageProps} />
      <ToastContainer />
    </MediaProvider>
  );
}

export default App;
/* export default withAuthenticator(App); */
