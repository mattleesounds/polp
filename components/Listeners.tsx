import React, { useEffect, useState } from "react";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import { Auth } from "aws-amplify";
import { Storage } from "aws-amplify";

type Listener = {
  name: string | undefined;
  email: string | undefined;
  sub: string;
};

type S3Object = {
  key: string;
  // You can add other properties if needed
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
        const collectorsPath = `collectors/${artistSub}/`;
        const collectors = (await Storage.list(
          collectorsPath
        )) as any as S3Object[];

        const userDetailsList: Listener[] = [];
        for (const collector of collectors) {
          const userSub = collector.key.split("/")[1];
          const params = {
            UserPoolId: "YOUR_COGNITO_USER_POOL_ID",
            Username: userSub,
          };
          const userResponse = await cognito.adminGetUser(params).promise();
          const nameAttr = userResponse.UserAttributes?.find(
            (attr) => attr.Name === "name"
          );
          const emailAttr = userResponse.UserAttributes?.find(
            (attr) => attr.Name === "email"
          );
          userDetailsList.push({
            name: nameAttr?.Value,
            email: emailAttr?.Value,
            sub: userSub,
          });
        }
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
