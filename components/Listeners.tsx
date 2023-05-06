import React, { useEffect, useState } from "react";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import { Auth, Storage } from "aws-amplify";
import ControlBar from "./ControlBar";

type Listener = {
  name: string | undefined;
  email: string | undefined;
  sub: string;
};

type S3Object = {
  key: string;
};

const ListenersPage = () => {
  const [listeners, setListeners] = useState<Listener[]>([]);

  useEffect(() => {
    const fetchListeners = async () => {
      try {
        const credentials = await Auth.currentCredentials();
        const cognito = new CognitoIdentityServiceProvider({
          region: "us-east-2",
          credentials: Auth.essentialCredentials(credentials),
        });

        const artistSub = (await Auth.currentAuthenticatedUser()).attributes
          .sub;
        console.log("Artist sub:", artistSub);

        const collectorsPath = `collectors/${artistSub}/`;
        const collectorsResult = (await Storage.list(collectorsPath)) as any;
        console.log("Collectors result:", collectorsResult);

        // Access the 'results' property to get the array of collectors
        const collectors = collectorsResult.results;

        const userDetailsList: Listener[] = [];
        for (const collector of collectors) {
          console.log("Collector:", collector); // Log the collector object
          // Extract the listener's sub from the third part of the key
          const userSub = collector.key.split("/")[2];
          console.log("User sub:", userSub); // Log the extracted user sub

          // Use listUsers with a filter to find the user by sub
          const params = {
            UserPoolId: "us-east-2_FpiogrBW5",
            Filter: `sub = "${userSub}"`,
          };
          const usersResponse = await cognito.listUsers(params).promise();
          console.log("Users response:", usersResponse); // Log the users response

          const user = usersResponse.Users?.[0]; // Get the first user from the response

          if (user) {
            const nameAttr = user.Attributes?.find(
              (attr) => attr.Name === "custom:Name"
            );
            const emailAttr = user.Attributes?.find(
              (attr) => attr.Name === "email"
            );
            userDetailsList.push({
              name: nameAttr?.Value,
              email: emailAttr?.Value,
              sub: userSub,
            });
          }
        }
        console.log("User details list:", userDetailsList);
        setListeners(userDetailsList);
      } catch (error) {
        console.error("Failed to fetch listeners:", error);
      }
    };

    fetchListeners();
  }, []);

  return (
    <div className="flex justify-center">
      <table className="w-[350px] border border-black md:w-[650px]">
        <thead>
          <tr className=" bg-black text-white">
            <th className="border border-black border-r-white px-2 py-2">
              Name
            </th>
            <th className="border border-black px-2 py-2">Email</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {listeners.map((listener) => (
            <tr
              key={listener.sub}
              className="border border-black bg-polp-white"
            >
              <td className="border border-black px-2 py-2">
                {listener.name || "Unknown"}
              </td>
              <td className="border border-black px-2 py-2">
                {listener.email || "Unknown"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ControlBar />
    </div>
  );
};

export default ListenersPage;
