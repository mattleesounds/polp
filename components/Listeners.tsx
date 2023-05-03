import React, { useEffect, useState } from "react";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import { Auth, Storage } from "aws-amplify";

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
        const collectorsResult = (await Storage.list(
          collectorsPath
        )) as any as S3Object[];

        console.log("Collectors result:", collectorsResult);

        // Ensure that collectors is an array
        const collectors = Array.isArray(collectorsResult)
          ? collectorsResult
          : [collectorsResult];

        const userDetailsList: Listener[] = [];
        for (const collector of collectors) {
          // Ensure that collector.key is defined before using split
          if (collector.key) {
            const userSub = collector.key.split("/")[1];
            console.log("User sub:", userSub);

            // Use listUsers with a filter to find the user by sub
            const params = {
              UserPoolId: "YOUR_COGNITO_USER_POOL_ID",
              Filter: `sub = "${userSub}"`,
            };
            const usersResponse = await cognito.listUsers(params).promise();
            console.log("Users response:", usersResponse);

            const user = usersResponse.Users?.[0]; // Get the first user from the response

            if (user) {
              const nameAttr = user.Attributes?.find(
                (attr) => attr.Name === "name"
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
    <div>
      <h1>Listeners</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Profile</th>
          </tr>
        </thead>
        <tbody>
          {listeners.map((listener) => (
            <tr key={listener.sub}>
              <td>{listener.name || "Unknown"}</td>
              <td>{listener.email || "Unknown"}</td>
              <td>
                {/* Replace "#" with the actual link to the user's profile */}
                <a href="#">View Profile</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListenersPage;
