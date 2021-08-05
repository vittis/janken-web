import { useEffect, useState } from "react";
import { Heading, Box } from "@chakra-ui/react";
import { useSocket } from "../context/socketContext";

const Welcome = () => {
  const { socket } = useSocket();
  const [name, setName] = useState("");
  const [wins, setWins] = useState("");

  useEffect(() => {
    if (socket) {
      socket.on("receivePersonalInfo", ({ name, wins }) => {
        setName(name);
        setWins(wins);
      });
    }

    return () => {
      if (socket) {
        socket.off("receivePersonalInfo");
      }
    };
  }, [socket]);

  if (!name) {
    return <></>;
  }

  return (
    <Heading mb={6} size="md">
      Welcome,{" "}
      <Box as="span" color="red.400">
        {name}
      </Box>{" "}
      <Box fontSize="sm" as="span" color="darkorange">
        ({wins} wins)
      </Box>
    </Heading>
  );
};

export default Welcome;
