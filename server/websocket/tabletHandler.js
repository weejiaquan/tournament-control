export const setupTabletWebSocket = (io) => {
    io.on("connection", (socket) => {
      console.log("Client connected with ID:", socket.id);
  
      socket.on("playerLogin", (data) => {
        console.log("Player login received:", data);
        io.emit("playerUpdate", data);
        console.log("Login update broadcast to all clients");
      });
  
      socket.on("playerLogout", (data) => {
        console.log("Player logout received:", data);
        io.emit("playerLogout", data);
        console.log("Logout event broadcast to all clients");
        
        const nullUpdate = { ...data, playerName: null };
        console.log("Sending null player update:", nullUpdate);
        io.emit("playerUpdate", nullUpdate);
      });
  
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  };