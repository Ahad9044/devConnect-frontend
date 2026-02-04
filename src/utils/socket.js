import { io } from "socket.io-client";

export const createSocketConnection = () => {
  // Use localhost in development and the same origin in production.
  // This avoids hard‑coding a different host (like www.) which can
  // break cookies / CORS and cause WebSocket connection errors.
  const serverUrl =
    location.hostname === "localhost"
      ? "http://localhost:3333"
      : location.origin.replace(/\/$/, "");

  return io(serverUrl, {
    path: "/socket.io/",
    withCredentials: true,
    transports: ["websocket", "polling"],
  });
};
