import { Heading, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSocket } from "../context/socketContext";

const LeaderBoards = () => {
  const { socket } = useSocket();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.on("broadcastLeaderboards", ({ players }) => {
        setPlayers(players);
      });
    }

    return () => {
      if (socket) {
        socket.off("broadcastLeaderboards");
      }
    };
  }, [socket]);

  return (
    <>
      <Heading my="5" size="lg">
        Hall of Fame 👑
      </Heading>
      {players.map((player) => (
        <Heading key={player.id} size="md">
          {player.name} -{" "}
          <Box as="span" color="darkorange">
            {player.wins} wins
          </Box>
        </Heading>
      ))}
    </>
  );
};

export default LeaderBoards;
