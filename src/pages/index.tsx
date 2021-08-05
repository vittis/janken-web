import Head from "next/head";
import { Box, Container, Heading } from "@chakra-ui/react";
import Particles from "../components/particles";
import ChatRoom from "../components/chatRoom";
import Lobby from "../components/lobby";
import GameView from "../components/GameView";
import Welcome from "../components/welcome";
import LeaderBoards from "../components/leaderboards";

export default function Home() {
  return (
    <>
      <Head>
        <title>Janken</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container centerContent>
        <Heading my={5} size="2xl">
          ✊ 🤚 ✌
        </Heading>

        <Welcome />

        <GameView />

        <LeaderBoards />

        <Lobby />
      </Container>

      <Box position="fixed" left="5" bottom="5">
        <ChatRoom />
      </Box>

      <Particles />
    </>
  );
}
