import React from "react";
import { Auth } from "aws-amplify";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import { Authenticator } from "@aws-amplify/ui-react";
import Link from "next/link";

const SignIn = () => {
  const handleGoogleSignIn = () => {
    Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google });
  };

  return (
    <div className="m-16 justify-center text-center">
      <h1>Welcome to POLP </h1>
      <br />
      <h1>You are not signed in. Thats lame af</h1>
      <br />
      <button
        onClick={() => Auth.federatedSignIn()}
        className="mb-8 h-16 w-32 rounded-lg bg-[#010101] text-[#FDFDFD]"
      >
        sign in with email
      </button>
      <br />
      <button
        onClick={handleGoogleSignIn}
        className="mb-8 h-16 w-32 rounded-lg bg-[#010101] text-[#FDFDFD]"
      >
        sign in with google
      </button>
    </div>
  );
};

export default SignIn;
