import "../styles/globals.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ContractKitProvider } from '@celo-tools/use-contractkit';
import '@celo-tools/use-contractkit/lib/styles.css';
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import "@fontsource/space-grotesk";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-lists/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-react-calendars/styles/material.css";


const theme = extendTheme({
  fonts: {
    heading: "Space Grotesk",
    body: "Space Grotesk",
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      {" "}
      <ChakraProvider theme={theme}>
        <ContractKitProvider
          dapp={{
            name: 'Blockchain Starter',
            description: 'Make your dreams with the power of Celo',
            url: 'https://celo.org',
          }}
        >
          <NavBar />
          <Component {...pageProps} />
          <Footer />{" "}
        </ContractKitProvider>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
