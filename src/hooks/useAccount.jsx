import React, { createContext, useContext, useEffect, useState } from "react";

const accountContext = createContext();

const AccountWrapper = ({ children }) => {
  const [userName, setUserName] = useState("nil");
  const [userID, setUserID] = useState(0);
  const [photo_url, setPhotoUrl] = useState("nil");

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;

      tg.ready();

      const user = tg.initDataUnsafe?.user;
      console.log("ssodda",user);

      if (user && user.username) {
        setUserName(user.username);
        setUserID(user.id); // Access the user's ID correctly
        setPhotoUrl(user.photo_url);
        console.log("SSDDFFGG",photo_url)
      } else {
        console.error("Username not available or user not logged in.");
      }
    } else {
      console.error("Telegram WebApp not loaded.");
    }
  }, []);

  return (
    <accountContext.Provider value={{ userName, setUserName, userID, setUserID, photo_url, setPhotoUrl }}>
      {children}
    </accountContext.Provider>
  );
};

export default AccountWrapper;

export const useAccount = () => {
  return useContext(accountContext);
};
