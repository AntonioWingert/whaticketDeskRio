import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "../Auth/AuthContext";
import { getBackendUrl } from "../../config";

const ProfileImageContext = createContext();

const ProfileImageProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [awayMessage, setAwayMessage] = useState('');
  const [offlineMessage, setOfflineMessage] = useState('');
  const [status, setStatus] = useState('online');
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const { user: loggedInUser } = useContext(AuthContext);

  const handleOpenStatusModal = () => {
    setStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setStatusModalOpen(false);
  };

  const handleStatusChange = (status) => {
    setStatus(status);
  };

  const handleAwayMessageChange = (value) => {
    setAwayMessage(value);
  };

  const handleOfflineMessageChange = (value) => {
    setOfflineMessage(value);
  };

  useEffect(() => {
    setUser(loggedInUser);
    setAwayMessage(loggedInUser.awayMessage);
    setOfflineMessage(loggedInUser.offlineMessage);
  }, [loggedInUser]);

  useEffect(() => {
    if (user) {
      setProfileImage(user.profileImage ? `${getBackendUrl()}/profilePics/${user.profileImage}` : null);
    }
  }, [user]);

  const updateProfileImage = (newProfileImage) => {
    setProfileImage(newProfileImage);
  };

  return (
    <ProfileImageContext.Provider
      value={{
        user,
        profileImage,
        updateProfileImage,
        handleOpenStatusModal,
        handleCloseStatusModal,
        handleStatusChange,
        status,
        statusModalOpen,
        handleAwayMessageChange,
        handleOfflineMessageChange,
        awayMessage,
        offlineMessage,
      }}
    >
      {children}
    </ProfileImageContext.Provider>
  );
};

export { ProfileImageContext, ProfileImageProvider };
