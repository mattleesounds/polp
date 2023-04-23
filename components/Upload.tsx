import React, { useState } from "react";
import { Storage } from "aws-amplify";
import { Auth } from "aws-amplify";
import ControlBar from "./ControlBar";
interface Metadata {
  title: string;
  sub: string;
  artist: string;
  description?: string;
}

const uploadFile = async (
  file: File,
  metadata: any,
  path: string
): Promise<string> => {
  console.log(
    `Uploading file: ${file.name}, size: ${file.size}, type: ${file.type}, metadata:`,
    metadata
  );
  const { key } = await Storage.put(path + file.name, file, {
    contentType: file.type,
    metadata,
  });

  return key;
};

const uploadImage = async (image: File, path: string): Promise<string> => {
  console.log(
    `Uploading image: ${image.name}, size: ${image.size}, type: ${image.type}`
  );
  const { key } = await Storage.put(path + image.name, image, {
    contentType: image.type,
  });

  return key;
};

const uploadMetadata = async (metadata: any, path: string): Promise<string> => {
  const { key } = await Storage.put(
    path + "metadata.json",
    JSON.stringify(metadata),
    {
      contentType: "application/json",
    }
  );

  return key;
};

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      setImage(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      // Ensure the user is signed in
      let currentUser;
      try {
        currentUser = await Auth.currentAuthenticatedUser();
      } catch (error) {
        console.error("User is not authenticated");
        return;
      }

      // Check for empty title and description
      if (!title) {
        console.error("Title is missing");
        return;
      }

      // Create the folder structure
      const subId = currentUser.attributes.sub;
      const folderPath = `media/${subId}_${title}/`;
      const metadataFolderPath = folderPath + "metadata/";

      // Metadata for the audio file
      // Metadata for the audio file
      const metadata: Metadata = {
        title: title,
        sub: subId.toString(),
        artist: currentUser.username,
      };
      if (description) {
        metadata.description = description;
      }

      // Upload audio file with metadata
      const uploadedFileKey = await uploadFile(file, metadata, folderPath);
      console.log("File uploaded:", uploadedFileKey);

      // Upload track image if available
      if (image) {
        const uploadedImageKey = await uploadImage(image, metadataFolderPath);
        console.log("Image uploaded:", uploadedImageKey);
      }

      // Upload metadata as JSON file
      const uploadedMetadataKey = await uploadMetadata(
        metadata,
        metadataFolderPath
      );
      console.log("Metadata uploaded:", uploadedMetadataKey);
    } catch (error) {
      if (error instanceof Error) {
        console.error("File or image upload failed:", error.message);
        console.error("Error details:", JSON.stringify(error, null, 2));
      } else {
        console.error("File or image upload failed:", error);
      }
    }
  };

  return (
    <div className="flex-col content-center justify-center text-center">
      <input
        type="text"
        placeholder="Track title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4 w-72 p-1 "
      />
      <br />
      <textarea
        rows={8}
        placeholder="Track description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-4 w-72 p-1 "
      />
      <br />
      <h2 className="text-lg text-polp-black">audio file</h2>
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="mb-4 bg-white"
      />
      <br />
      <h2 className="text-lg text-polp-black">cover image file</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-8 bg-white"
      />
      <br />
      <button
        onClick={handleUpload}
        className="h-8 w-32 rounded-lg bg-polp-black text-white"
      >
        upload track
      </button>
      <ControlBar />
    </div>
  );
};

export default Upload;
