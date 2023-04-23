import React, { useEffect } from "react";
import { Storage, Auth } from "aws-amplify";
import awsconfig from "../src/aws-exports"; // Update the path to your aws-exports file
import AWS from "aws-sdk";

const GetMetadataExample = () => {
  const trackId = "e42b7879-291e-49d2-aadb-ef0d984ae053";
  const filename =
    "John Coltrane - Giant Steps (2020 Remaster) [Official Audio].mp3";
  const key = `public/media/${trackId}/${filename}`;

  useEffect(() => {
    const getMetadata = async () => {
      try {
        // Get the credentials using Amplify Auth
        const credentials = await Auth.currentCredentials();

        // Configure the AWS SDK with the Amplify credentials
        AWS.config.update({
          region: awsconfig.aws_project_region,
          credentials: Auth.essentialCredentials(credentials),
        });

        const S3 = new AWS.S3();

        const params = {
          Bucket: awsconfig.aws_user_files_s3_bucket,
          Key: key,
        };
        const response = await S3.headObject(params, (err, data) => {
          if (err) {
            console.error("Error retrieving metadata:", err);
          } else {
            if (data.Metadata) {
              console.log("Metadata:", data.Metadata);
              // Access custom metadata
              const title = data.Metadata.title;
              const artistName = data.Metadata.artistname;
              const artistSubId = data.Metadata.artistsubid;
              const color = data.Metadata.color;
              console.log("Title:", title);
              console.log("Artist Name:", artistName);
              console.log("Artist Sub ID:", artistSubId);
              console.log("Color:", color);
            } else {
              console.log("Metadata is undefined");
            }
          }
        });
        console.log("Metadata:", response);
      } catch (error) {
        console.error("Error retrieving metadata:", error);
      }
    };
    getMetadata();
  }, []);

  return <div>Get Metadata Example</div>;
};

export default GetMetadataExample;
