import AWS from 'aws-sdk';
import { Auth } from 'aws-amplify';

export const getArtistNameBySubId = async (subId: string) => {
  try {
    // Get the current user's credentials from Amplify
    const credentials = await Auth.currentCredentials();

    // Update the AWS SDK configuration with the obtained credentials and region
    AWS.config.update({
      credentials: Auth.essentialCredentials(credentials),
      region: 'us-east-2',
    });

    // Create an instance of the CognitoIdentityServiceProvider client
    const cognito = new AWS.CognitoIdentityServiceProvider();

    // Define the parameters for the listUsers method
    const params = {
      UserPoolId: 'us-east-2_FpiogrBW5',
      Filter: `sub = "${subId}"`, // Filter users based on the sub attribute
    };

    // Call the listUsers method to search for users based on the sub attribute
    const response = await cognito.listUsers(params).promise();

    // Check if any users were found
    if (response.Users && response.Users.length > 0) {
      // Get the first user from the response
      const user = response.Users[0];

      // Find the custom:Name attribute in the user's attributes using optional chaining
      const artistNameAttr = user.Attributes?.find(attr => attr.Name === 'custom:Name');
      const artistName = artistNameAttr ? artistNameAttr.Value : 'Unknown';
      return artistName;
    } else {
      return 'Unknown';
    }
  } catch (error) {
    console.error('Failed to get artist name:', error);
    return 'Unknown';
  }
};
