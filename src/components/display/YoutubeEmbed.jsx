import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const YouTubeEmbed = () => {
  const [videoId, setVideoId] = useState('');

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch('/api/video');
        const data = await response.json();
        if (data.videoId) {
          setVideoId(data.videoId);
        }
      } catch (error) {
        console.error('Failed to fetch video ID:', error);
      }
    };

    fetchVideo();
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchVideo, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!videoId) return null;

  return (
    <VideoContainer>
      <VideoFrame
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playlist=${videoId}&loop=1`}
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