import AWS from 'aws-sdk';
import { Auth } from 'aws-amplify';

export const getArtistNameBySubId = async (subId: string) => {
  try {
    // Get the current user's credentials from Amplify
    const credentials = await Auth.currentCredentials();

    // Update the AWS SDK configuration with the obtained credentials and region
    AWS.config.update({
      credentials: Auth.essentialCredentials(credentials),
      region: 'us-east-2', // Specify the region here
    });

    // Create an instance of the CognitoIdentityServiceProvider client
    // after setting the region and credentials
    const cognito = new AWS.CognitoIdentityServiceProvider();

    // Define the parameters for the adminGetUser method
    const params = {
      UserPoolId: 'YOUR_COGNITO_USER_POOL_ID', // Replace with your Cognito User Pool ID
      Username: subId, // The subId of the artist
    };

    // Call the adminGetUser method to fetch user attributes
    const response = await cognito.adminGetUser(params).promise();

    // Check if UserAttributes is defined
    if (response.UserAttributes) {
      // Find the custom:Name attribute in the response
      const artistNameAttr = response.UserAttributes.find(attr => attr.Name === 'custom:Name');
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
