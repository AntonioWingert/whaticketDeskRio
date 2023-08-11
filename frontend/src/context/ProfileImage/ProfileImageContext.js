import React, { createContext, useState } from "react";

const ProfileImageContext = createContext();

const ProfileImageProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [profileImage, setProfileImage] = useState(null);

  const handleUser = (user) => {
    setUser(user);
  }

  const handleProfileImage = (profileImage) => {
    setProfileImage(profileImage);
  }

  return (
    <ProfileImageContext.Provider
      value={{ user, profileImage, handleUser, handleProfileImage }}
    >
      {children}
    </ProfileImageContext.Provider>
  );
};

export { ProfileImageContext, ProfileImageProvider };
