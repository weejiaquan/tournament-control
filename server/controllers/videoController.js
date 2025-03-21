let videoState = {
    videoId: ''
  };
  
  export const getVideo = (req, res) => {
    res.json({ videoId: videoState.videoId });
  };
  
  export const setVideo = (req, res) => {
    const { videoId } = req.body;
    if (!videoId) {
      return res.status(400).json({ error: 'Video ID is required' });
    }
    videoState.videoId = videoId;
    res.json({ success: true, videoId });
  };
  
  export const clearVideo = (req, res) => {
    videoState.videoId = '';
    res.json({ success: true });
  };