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
    <div className="flex-col content-center justify-center text-center ">
      <input
        type="text"
        placeholder="Track title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4"
      />
      <br />
      <input
        type="text"
        placeholder="Track description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-4"
      />
      <br />
      <h2 className="mb-1 text-polp-orange">audio file</h2>
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="mb-4 bg-white"
      />
      <br />
      <h2 className="mb-1 text-polp-orange">cover image file</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-8 bg-white"
      />
      <br />
      <button
        onClick={handleUpload}
        className="h-8 w-32 rounded-lg bg-polp-orange"
      >
        upload track
      </button>
    </div>
  );
};

export default UploadFile;
