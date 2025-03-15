import React from 'react';
import styled from 'styled-components';

const YouTubeEmbed = ({ videoId }) => {
  return (
    <VideoContainer>
      <VideoFrame
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </VideoContainer>
  );
};

const VideoContainer = styled.div`
  width: 80%;
  max-width: 1280px;
  aspect-ratio: 16/9;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const VideoFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 12px;
`;

export default YouTubeEmbed;