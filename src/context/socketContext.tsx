import { createContext, useContext, useEffect, useState } from "react";
import ioClient, { Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "https://janken-api.herokuapp.com";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket>(null);

  useEffect(() => {
    setSocket(ioClient(SOCKET_SERVER_URL));
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
