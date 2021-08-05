import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { SocketProvider } from "context/socketContext";
import { AppProps } from "next/dist/next-server/lib/router/router";
import "styles/global.scss";

const customTheme = extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: "dark",
  },
});

export const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider theme={customTheme}>
      <SocketProvider>
        <Component {...pageProps} />
      </SocketProvider>
    </ChakraProvider>
  );
};

export default App;
