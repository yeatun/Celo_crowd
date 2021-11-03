import {
    Box,
    chakra,
    Container,
    Link,
    Stack,
    Text,
    Button,
    useColorModeValue,
    VisuallyHidden,
    Heading,
    useBreakpointValue,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
  } from "@chakra-ui/react";
  import { FaInstagram, FaTwitter, FaGithub, FaGlobe } from "react-icons/fa";
  import NextLink from "next/link";
//   import FrontPage from './FrontPage';
import { useContractKit } from '@celo-tools/use-contractkit';
import { ChevronDownIcon } from "@chakra-ui/icons";
  const ConnectWallet = ({ children, label, href }) => {
   
    return (
      <chakra.button
        // bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
        rounded={"full"}
        w={8}
        h={8}
        cursor={"pointer"}
        as={"a"}
        href={href}
        display={"inline-flex"}
        alignItems={"center"}
        justifyContent={"center"}
        transition={"background 0.3s ease"}
        // _hover={{
        //   bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
        // }}
        target="_blank"
        rel="noopener noreferrer"
      >
        <VisuallyHidden>{label}</VisuallyHidden>
        {children}
      </chakra.button>
    );
  };
  
  export default function FrontPage() {
    const { connect, address, destroy } = useContractKit();
    return (
      <Box
     marginTop={300}
    //   paddingTop={10}
      borderStyle={"solid"}
    //   borderColor={useColorModeValue("gray.200", "gray.700")}
    //     bg={useColorModeValue("gray.50", "gray.900")}
    //     color={useColorModeValue("gray.700", "gray.200")}
      >
        <Container
          as={Stack}
          maxW={"6xl"}
          py={4}
          spacing={4}
          justify={"center"}
          align={"center"}
        >
          <Heading
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily={"heading"}
            // color={useColorModeValue("teal.800", "white")}
            as="h2"
            size="sm"
          >
            <Box
            //   as={"span"}
            // //   color={useColorModeValue("teal.400", "teal.300")}
            //   position={"relative"}
            //   zIndex={10}
            //   _after={{
            //     content: '""',
            //     position: "absolute",
            //     left: 0,
            //     bottom: 0,
            //     w: "full",
            //     h: "30%",
            //     // bg: useColorModeValue("teal.100", "teal.900"),
            //     zIndex: -1,
            //   }}
            >
                 {address ? (
              <Menu>
                <MenuButton as={Button}  rightIcon={<ChevronDownIcon />}>
                  {address}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={destroy}>
                    {" "}
                    Disconnect Wallet{" "}
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <div>
                <Button
                //   display={{ base: "none", md: "inline-flex" }}
                  fontSize={"md"}
                  fontWeight={600}
                  color={"white"}
                  bg={"teal.400"}
                  href={"#"}
                  _hover={{
                    bg: "teal.300",
                  }}
                  onClick={connect}
                 
                >
                  Connect Wallet{" "}
                </Button>
              </div>
            )}
              {/* <NextLink href="/">BlockchainStarter</NextLink> */}
            </Box>
          </Heading>
          {/* <Stack direction={"row"} spacing={6}>
            <NextLink href="/">Home</NextLink>
            <Link
              href={
                "https://github.com/harsh242/blockchainstarter-crowdfunding-in-blockchain"
              }
              isExternal
            >
              Github
            </Link>
            <Link href={"mailto:harshbadhai242@gmail.com"} isExternal>
              Contact
            </Link>
          </Stack> */}
        </Container>
  
     
      </Box>
    );
  }
  