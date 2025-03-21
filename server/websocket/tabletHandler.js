export const setupTabletWebSocket = (io) => {
    io.on("connection", (socket) => {
      console.log("Client connected");
  
      socket.on("playerLogin", (data) => {
        console.log("Player logged in:", data);
        io.emit("playerUpdate", data);
      });
  
      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  };