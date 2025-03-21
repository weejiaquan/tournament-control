let sceneState = {
    currentScene: 'landing'
  };
  
  export const getCurrentScene = (req, res) => {
    res.json({ currentScene: sceneState.currentScene });
  };
  
  export const setScene = (req, res) => {
    const { scene } = req.body;
    sceneState.currentScene = scene;
    res.json({ success: true, currentScene: scene });
  };