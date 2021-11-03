import "../styles/globals.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ContractKitProvider, NetworkNames } from '@celo-tools/use-contractkit';
import '@celo-tools/use-contractkit/lib/styles.css';
import NavBar from "../components/Navbar";
// import Footer from "../components/Footer";
import "@fontsource/space-grotesk";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-lists/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-react-calendars/styles/material.css";
import FrontPage from "../components/FrontPage";
// import Footer from './../components/Footer';
// import Posts from "../components/Posts";
import Posts from './../components/Posts';

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
          nnetwork={{
            name: NetworkNames.Alfajores,
            rpcUrl: 'https://alfajores-forno.celo-testnet.org',
            graphQl: 'https://alfajores-blockscout.celo-testnet.org/graphiql',
            explorer: 'https://alfajores-blockscout.celo-testnet.org',
            chainId: 44787,
          }}
        >
          <NavBar />
          <FrontPage></FrontPage>
          <Posts></Posts>
          {/* <Component {...pageProps} /> */}
          {/* <Footer /> */}
         {" "}
        
        </ContractKitProvider>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
