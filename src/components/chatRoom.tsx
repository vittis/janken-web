import { Box, IconButton, Flex, Input, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/socketContext";
import { SmallCloseIcon, ChatIcon } from "@chakra-ui/icons";
import { useBoolean } from "@chakra-ui/react";

interface IncomingChatMessage {
  body: string;
  senderName: string;
  senderId: string;
}

interface ChatMessage extends IncomingChatMessage {
  ownedByCurrentUser: boolean;
}

const ChatRoom = () => {
  const { socket } = useSocket();
  const [value, setValue] = useState("");
  const handleChange = (event) => setValue(event.target.value);
  const [chatOpen, setChatOpen] = useBoolean(true);
  const chatBoxRef = useRef<HTMLDivElement>();
  const inputRef = useRef<HTMLInputElement>();

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (socket) {
      // Listens for incoming messages
      socket.on("newChatMessage", (message: IncomingChatMessage) => {
        const incomingMessage = {
          ...message,
          ownedByCurrentUser: message.senderId === socket.id,
        };
        setMessages((messages) => [...messages, incomingMessage]);
      });
    }

    return () => {
      if (socket) {
        socket.off("newChatMessage");
      }
    };
  }, [socket]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (chatOpen) {
      inputRef?.current?.focus();
    }
  }, [chatOpen]);

  const sendMessage = (messageBody: string) => {
    socket.emit("newChatMessage", {
      body: messageBody,
      senderId: socket.id,
    });
  };

  if (!chatOpen) {
    return (
      <IconButton
        onClick={setChatOpen.toggle}
        colorScheme="gray"
        rounded="full"
        icon={<ChatIcon />}
        aria-label="Open Chat"
        size="lg"
      />
    );
  }

  return (
    <Flex
      direction="column"
      minW="xs"
      maxW="xs"
      borderWidth="2px"
      borderRadius="lg"
      p={3}
    >
      <IconButton
        position="absolute"
        top="0"
        right="0"
        onClick={setChatOpen.toggle}
        colorScheme="gray"
        bg="transparent"
        icon={<SmallCloseIcon />}
        aria-label="Close Chat"
      />
      <Box
        ref={chatBoxRef}
        minH="xs"
        maxH="xs"
        flex={1}
        mb="3"
        overflowY="scroll"
      >
        {messages.map((message, index) => {
          return (
            <>
              {message.senderName ? (
                <Text key={index} fontSize="md">
                  <Box as="span" color="teal.400">
                    {message.senderName}:
                  </Box>{" "}
                  {message.body}
                </Text>
              ) : (
                <Text key={index} color="orange.400" fontSize="md">
                  {message.body}
                </Text>
              )}
            </>
          );
        })}
      </Box>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(value);
          setValue("");
        }}
      >
        <Input
          ref={inputRef}
          value={value}
          onChange={handleChange}
          placeholder="Enter your message..."
        />
      </form>
    </Flex>
  );
};

export default ChatRoom;
