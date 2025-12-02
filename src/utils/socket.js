import io from "socket.io-client";

export const createSocketConnection = () => {
    return io(location.hostname === "localhost" 
        ? "http://localhost:3333" 
        : "https://www.devconnect.asia", {
            path: "/socket.io/",
            withCredentials: true
        }
    );
};
