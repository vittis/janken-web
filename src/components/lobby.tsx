import { AddIcon } from "@chakra-ui/icons";
import {
  Wrap,
  WrapItem,
  Flex,
  Box,
  Stack,
  Badge,
  Button,
  Heading,
} from "@chakra-ui/react";
import { useSocket } from "../context/socketContext";
import { useCallback, useEffect, useState } from "react";

enum RoomStatus {
  OPEN = "OPEN",
  FULL = "FULL",
  IN_PROGRESS = "IN_PROGRESS",
}

interface Room {
  id: string;
  players: {
    id: string;
    name: string;
  }[];
  status: RoomStatus;
}

const Lobby = () => {
  const { socket } = useSocket();

  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    if (socket) {
      socket.on("broadcastRooms", ({ rooms }: { rooms: Room[] }) => {
        setRooms(rooms);
      });
    }

    return () => {
      if (socket) {
        socket.off("broadcastRooms");
      }
    };
  }, [socket]);

  const isInAnyRoom = useCallback(() => {
    return (
      rooms.filter((room) => {
        return !!room.players.find((player) => player.id === socket.id);
      }).length > 0
    );
  }, [rooms]);

  const askCreateRoom = () => {
    socket.emit("askCreateRoom", {
      ownerId: socket.id,
    });
  };

  const askLeaveRoom = (roomId: string) => {
    socket.emit("askLeaveRoom", {
      roomId,
    });
  };

  const askJoinRoom = (roomId: string) => {
    socket.emit("askJoinRoom", {
      roomId,
    });
  };

  const askStartGame = (roomId: string) => {
    socket.emit("askStartGame", {
      roomId,
    });
  };

  return (
    <>
      <Heading mt="10" size="xl">
        Rooms 🚪
      </Heading>
      <Button
        my="3"
        onClick={askCreateRoom}
        rightIcon={<AddIcon />}
        colorScheme="teal"
        variant="ghost"
        disabled={isInAnyRoom()}
      >
        Create room
      </Button>

      <Wrap mb="5">
        {rooms.map((room) => {
          const isInRoom = room.players.find(
            (player) => player.id === socket.id
          );
          const isRoomOpen = room.status === RoomStatus.OPEN;
          const isInProgress = room.status === RoomStatus.IN_PROGRESS;

          return (
            <WrapItem
              display="flex"
              justifyContent="space-between"
              key={room.id}
              p="2"
              minW="210px"
              h="85px"
              borderWidth="2px"
              borderRadius="md"
            >
              <Flex h="100%" direction="column" justifyContent="space-evenly">
                {room.players.map((player) => (
                  <Box key={player.id}>{player.name}</Box>
                ))}
              </Flex>
              <Stack h="100%" direction="column" justifyContent="space-evenly">
                {isInProgress && (
                  <Badge fontSize="xs" colorScheme="red">
                    In Progress
                  </Badge>
                )}

                {isInRoom && room.status !== RoomStatus.IN_PROGRESS && (
                  <>
                    <Button
                      onClick={() => askStartGame(room.id)}
                      variant="outline"
                      disabled={room.status !== RoomStatus.FULL}
                      size="sm"
                      colorScheme="green"
                    >
                      Start
                    </Button>

                    <Button
                      onClick={() => askLeaveRoom(room.id)}
                      variant="outline"
                      size="sm"
                      colorScheme="red"
                    >
                      Leave
                    </Button>
                  </>
                )}
                {!isInAnyRoom() && isRoomOpen && (
                  <Button
                    onClick={() => askJoinRoom(room.id)}
                    variant="outline"
                    size="sm"
                    colorScheme="teal"
                  >
                    Join
                  </Button>
                )}
              </Stack>
            </WrapItem>
          );
        })}
      </Wrap>
    </>
  );
};

export default Lobby;
