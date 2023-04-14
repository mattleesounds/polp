import React, { useState } from "react";
import { Storage } from "aws-amplify";
import { Auth } from "aws-amplify";

const uploadFile = async (file: File, metadata: any): Promise<string> => {
  const { key } = await Storage.put(file.name, file, {
    contentType: file.type,
    metadata,
  });

  return key;
};

const uploadImage = async (image: File): Promise<string> => {
  const { key } = await Storage.put(image.name, image, {
    contentType: image.type,
  });

  return key;
};

const UploadFile = () => {
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
      // Metadata for the audio file
      const metadata = {
        title,
        description,
      };

      // Upload audio file with metadata
      const uploadedFileKey = await uploadFile(file, metadata);
      console.log("File uploaded:", uploadedFileKey);

      // Upload track image if available
      if (image) {
        const uploadedImageKey = await uploadImage(image);
        console.log("Image uploaded:", uploadedImageKey);
      }
    } catch (error) {
      console.error("File or image upload failed:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Track title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Track description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadFile;
