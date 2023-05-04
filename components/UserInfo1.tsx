import React from "react";

const UserInfo = () => {
  return (
    <div className="relative m-4 h-auto w-[92%] rounded-lg bg-white p-4">
      <div>
        <h1 className="text-xl font-bold">Wallet</h1>
        <p>listenership.eth</p>
      </div>
      <div className="h-2"></div>
      <div>
        <h1 className="text-xl font-bold">Email</h1>
        <p>matt@polp.app | theo@polp.app</p>
      </div>
      <div className="h-2"></div>
      <div>
        <h1 className="text-xl font-bold">Location</h1>
        <p>New Orleans, LA, USA</p>
      </div>
    </div>
  );
};

export default UserInfo;
