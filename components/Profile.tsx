// components/Profile.tsx
import React, { useEffect, useState } from "react";
import { Auth, Storage } from "aws-amplify";
import { CognitoUser } from "@aws-amplify/auth";
import Image from "next/image";

interface UserProfile {
  name: string;
  email: string;
  profilePicture: string | null;
  bio?: string;
}

const Profile = (): JSX.Element => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formValues, setFormValues] = useState<UserProfile>({
    name: "",
    email: "",
    profilePicture: null,
    bio: "",
  });
  const [uploading, setUploading] = useState(false);
  const [profilePictureSrc, setProfilePictureSrc] = useState(
    userProfile?.profilePicture || "/logo.png"
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user: CognitoUser | null = await Auth.currentAuthenticatedUser();
        if (user) {
          const attributes = await Auth.userAttributes(user);
          const emailAttr = attributes.find(
            (attr) => attr.getName() === "email"
          );
          const nameAttr = attributes.find(
            (attr) => attr.getName() === "custom:Name"
          );
          const bioAttr = attributes.find(
            (attr) => attr.getName() === "custom:Bio"
          );
          const subAttribute = attributes.find(
            (attr) => attr.getName() === "sub"
          );
          const sub = subAttribute ? subAttribute.getValue() : "";
          let profilePicture: string | null = null;
          try {
            profilePicture = await Storage.get(`profile-pictures/${sub}`);
          } catch (error) {
            console.log("pfp error");
          }
          const profile = {
            name: nameAttr ? nameAttr.getValue() : "",
            email: emailAttr ? emailAttr.getValue() : "",
            profilePicture,
            bio: bioAttr ? bioAttr.getValue() : "",
          };
          setUserProfile(profile);
          setFormValues(profile);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setSelectedFile(file);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("submitting");
    try {
      const user: CognitoUser | null = await Auth.currentAuthenticatedUser();
      const attributes = await Auth.userAttributes(user);
      const subAttribute = attributes.find((attr) => attr.getName() === "sub");
      const sub = subAttribute ? subAttribute.getValue() : "";

      if (user && sub) {
        await Auth.updateUserAttributes(user, {
          email: formValues.email,
          "custom:Name": formValues.name,
          "custom:Bio": formValues.bio,
        });
        setUserProfile(formValues);
        setEditMode(false);
      }

      // Upload profile picture if a file is selected
      if (selectedFile) {
        console.log("uploading image");
        const result = await Storage.put(
          `profile-pictures/${sub}`,
          selectedFile,
          {
            contentType: selectedFile.type,
          }
        );
        const url = await Storage.get((result as any).key);
        setUserProfile(
          (prev) => ({ ...prev, profilePicture: url } as UserProfile)
        );
        console.log(userProfile);
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  /* userProfile?.profilePicture ||  */

  return (
    <div className="container mx-auto">
      <div className="my-12 flex flex-col items-center">
        <h1 className="mb-6 mt-8 text-4xl">Profile</h1>
        <div className="w-full rounded-md border border-gray-300 p-6 sm:w-96">
          <div className="h-full">
            <img
              src={userProfile?.profilePicture || "/logo.png"}
              alt="Profile"
              className="mx-auto h-32 w-32 rounded-full"
              loading="lazy"
              width="120"
              height="120"
            />
          </div>
          {!editMode && (
            <div>
              <div className="mt-6">
                <h2 className="text-xl font-semibold">Name</h2>
                <p className="text-gray-700">{userProfile?.name}</p>
              </div>
              <div className="mt-4">
                <h2 className="text-xl font-semibold">Email</h2>
                <p className="text-gray-700">{userProfile?.email}</p>
              </div>
              <div className="mt-4">
                <h2 className="text-xl font-semibold">Bio</h2>
                <p className="whitespace-pre-wrap text-gray-700">
                  {userProfile?.bio || "No bio available"}
                </p>
              </div>
              {/* Add more fields here as needed */}
            </div>
          )}
          {editMode && (
            <form onSubmit={handleSubmit} className="mt-6">
              <label htmlFor="profilePicture" className="block text-gray-700">
                Profile Picture
              </label>
              <input
                type="file"
                name="profilePicture"
                id="profilePicture"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2 w-full rounded-md border border-gray-300 p-2"
              />
              <label htmlFor="username" className="block text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formValues.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-gray-300 p-2"
              />
              <label htmlFor="email" className="mt-4 block text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formValues.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-gray-300 p-2"
              />
              <label htmlFor="bio" className="mt-4 block text-gray-700">
                Bio
              </label>
              <textarea
                name="bio"
                id="bio"
                value={formValues.bio}
                onChange={handleChange}
                maxLength={2000}
                className="mt-2 h-32 w-full rounded-md border border-gray-300 p-2"
              />
              {/* Add more input fields here as needed */}
              <button
                type="submit"
                className="mt-4 w-full rounded-md bg-blue-600 p-2 text-white"
                onClick={handleSubmit}
              >
                Save Changes
              </button>
            </form>
          )}
          <button
            onClick={() => setEditMode(!editMode)}
            className="mt-4 w-full rounded-md bg-blue-600 p-2 text-white"
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
