import React, { createContext, useContext, useState } from "react";

const VideoPlaybackContext = createContext();

export const VideoPlaybackProvider = ({ children }) => {
    const [currentVideo, setCurrentVideo] = useState(null);

    return (
        <VideoPlaybackContext.Provider
            value={{ currentVideo, setCurrentVideo }}
        >
            {children}
        </VideoPlaybackContext.Provider>
    );
};

export const useVideoPlayback = () => useContext(VideoPlaybackContext);
