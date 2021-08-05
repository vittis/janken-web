import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { useSocket } from "../context/socketContext";

export enum Action {
  ROCK = "ROCK",
  PAPER = "PAPER",
  SCISSORS = "SCISSORS",
}

const GameView = () => {
  const { socket } = useSocket();

  const [gameId, setGameId] = useState("");
  const [players, setPlayers] = useState([]);
  const [status, setStatus] = useState("");
  const [chosenAction, setChosenAction] = useState<Action>();
  const [winnerId, setWinnerId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (socket) {
      socket.on("gameUpdated", ({ id, players, status, winnerId }) => {
        setGameId(id);
        setPlayers(players);
        setStatus(status);
        if (winnerId) {
          setWinnerId(winnerId);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("gameStarted");
      }
    };
  }, [socket]);

  const askMakePlay = (action: Action) => {
    setChosenAction(action);
    socket.emit("askMakePlay", {
      gameId,
      action,
    });
  };

  const isWinner = useCallback(() => {
    return !!players.find(
      (player) => player.id === socket.id && player.id === winnerId
    );
  }, [players, winnerId]);

  const clearGame = () => {
    setGameId(undefined);
    setPlayers([]);
    setStatus("");
    setChosenAction(undefined);
    setWinnerId(undefined);
  };

  if (!gameId) {
    return <></>;
  }

  return (
    <Modal
      closeOnOverlayClick={false}
      onClose={() => clearGame()}
      isOpen={!!gameId}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader display="flex" justifyContent="center">
          {!winnerId ? (
            <>
              {players?.[0]?.name} vs {players?.[1]?.name}
            </>
          ) : (
            <>
              {winnerId === "TIE" ? (
                <>{`It's a tie! 🤯`}</>
              ) : (
                <>{isWinner() ? "You won! 🎉" : "You lost... 😒"}</>
              )}
            </>
          )}
        </ModalHeader>
        {winnerId && <ModalCloseButton />}
        <ModalBody display="flex" justifyContent="center">
          {status}
        </ModalBody>
        <ModalFooter display="flex" justifyContent="center">
          <Stack direction="row">
            {(!chosenAction || chosenAction === Action.ROCK) && (
              <Button
                disabled={!!chosenAction}
                onClick={() => askMakePlay(Action.ROCK)}
                colorScheme="red"
              >
                Rock ✊
              </Button>
            )}
            {(!chosenAction || chosenAction === Action.PAPER) && (
              <Button
                disabled={!!chosenAction}
                onClick={() => askMakePlay(Action.PAPER)}
                colorScheme="yellow"
              >
                Paper 🤚
              </Button>
            )}
            {(!chosenAction || chosenAction === Action.SCISSORS) && (
              <Button
                disabled={!!chosenAction}
                onClick={() => askMakePlay(Action.SCISSORS)}
                colorScheme="blue"
              >
                Scissors ✌
              </Button>
            )}
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GameView;
