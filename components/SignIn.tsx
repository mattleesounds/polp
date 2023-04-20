import React from "react";
import { Auth } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import Link from "next/link";

const SignIn = () => {
  return (
    <div className="m-16 justify-center text-center">
      <h1>Welcome to POLP </h1>
      <br />
      <h1>You are not signed in. Thats lame af</h1>
      <br />
      <button
        onClick={() => Auth.federatedSignIn()}
        className="h-8 w-24 rounded-lg bg-[#010101] text-[#FDFDFD]"
      >
        sign in
      </button>
    </div>
  );
};

export default SignIn;
