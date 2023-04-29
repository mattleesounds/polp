import React, { useEffect, useState } from "react";
import Track from "./Track";
import MediaContext from "./MediaContext";
import { useContext } from "react";
import { Auth, Storage } from "aws-amplify";
import { TrackType } from "./MediaContext";

const CollectionPage = (): JSX.Element => {
  const { tracks } = useContext(MediaContext);
  const [collectedTracks, setCollectedTracks] = useState<TrackType[]>([]);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        // Get the current authenticated user's sub (unique identifier)
        const user = await Auth.currentAuthenticatedUser();
        const userSub = user.attributes.sub;

        // Get the list of artist sub-IDs for the current user's collection
        const listResult = await Storage.list(`collections/${userSub}/`);
        const artistSubIds = listResult.results
          .map((item) => item.key?.split("/")[2]) // Use optional chaining here
          .filter((subId) => subId !== undefined); // Filter out undefined values

        // Initialize an array to store the track IDs from all artists
        const allTrackIds: string[] = [];

        // Fetch track data for each artist sub-ID
        for (const artistSub of artistSubIds) {
          // Construct the path to the JSON file in the user's collection
          const userCollectionPath = `collections/${userSub}/${artistSub}/collection.json`;

          // Download the collection JSON file from S3
          const collectionFileUrl = await Storage.get(userCollectionPath);
          const collectionResponse = await fetch(collectionFileUrl as string);
          const collectionData = await collectionResponse.json();
          const trackIds = collectionData.trackIds || [];

          // Add the track IDs to the allTrackIds array
          allTrackIds.push(...trackIds);
        }

        // Filter the tracks to only include those collected by the user
        const collected = tracks.filter((track) =>
          allTrackIds.includes(track.trackId)
        );

        // Update the collectedTracks state
        setCollectedTracks(collected);
      } catch (error) {
        console.error("Error fetching collection data:", error);
      }
    };
    fetchCollection();
  }, [tracks]);

  return (
    <div className="z-0 m-2 mb-2 flex h-full flex-col place-items-center bg-polp-grey pb-24">
      {collectedTracks.map((track) => (
        <Track key={track.trackId} track={track} />
      ))}
    </div>
  );
};

export default CollectionPage;
