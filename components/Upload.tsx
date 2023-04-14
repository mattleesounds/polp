import React from "react";
import { Storage } from "aws-amplify";
import { useState } from "react";
import { Auth } from "aws-amplify";
//Here's a comment

const uploadFile = async (file: File): Promise<string> => {
  const { key } = await Storage.put(file.name, file, {
    contentType: file.type,
  });

  return key;
};

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    //////////////////////////
    try {
      const session = await Auth.currentSession();
      console.log("User session data:", session);
    } catch (error) {
      console.error("Error getting user session data:", error);
    }
    //////////////////////////
    if (!file) return;

    try {
      const uploadedFileKey = await uploadFile(file);
      console.log("File uploaded:", uploadedFileKey);
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default Upload;
