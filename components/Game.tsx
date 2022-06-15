import { useState, useEffect } from "react";
import { supabase } from "@services/supabase";
import { User, Game, UserAccountType } from "../types";
import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Badge,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Link,
  List,
  ListIcon,
  ListItem,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Spacer,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Wrap,
  WrapItem,
  chakra,
} from "@chakra-ui/react";
import { TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons";

type GameProps = {
  user: User;
  data: UserAccountType | undefined;
};
const Game = ({ user, data }: GameProps): JSX.Element => {
  const [game, setGame] = useState<Game | null>(null);
  const [buyIn, setBuyIn] = useState(0);
  const [newGame, setNewGame] = useState("");
  const [errorText, setError] = useState("");

  useEffect(() => {
    fetchGame();
  }, []);

  const fetchGame = async () => {
    const { data: games, error } = await supabase
      .from("games")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) console.error("error", error);
    else setGame(games[0]);
  };

  function buyInWrap(n: number) {
    setBuyIn(n);
  }

  async function createNewGame() {
    const user_id = user.id ?? "-1";
    const { data, error } = await supabase
      .from("games")
      .insert([
        {
          buy_in: buyIn * 100000000,
          created_by: user_id,
          players: {
            [user_id]: {
              name: user.id,
              email: user.email,
            },
          },
        },
      ])
      .single();
    if (error) console.error("error", error);
    else console.log(data);
  }

  return (
    <Container centerContent width={"container.xl"}>
      <Heading>Your Game Name</Heading>
      <Text>Some minor blah blah blah</Text>
      <Wrap>
        <WrapItem>
          <Avatar name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
        </WrapItem>
        <WrapItem>
          <Avatar
            name='Kola Tioluwani'
            src='https://bit.ly/tioluwani-kolawole'
          />
        </WrapItem>
        <WrapItem>
          <Avatar name='Kent Dodds' src='https://bit.ly/kent-c-dodds' />
        </WrapItem>
        <WrapItem>
          <Avatar name='Ryan Florence' src='https://bit.ly/ryan-florence' />
        </WrapItem>
        <WrapItem>
          <Avatar name='Prosper Otemuyiwa' src='https://bit.ly/prosper-baba' />
        </WrapItem>
        <WrapItem>
          <Avatar name='Christian Nwamba' src='https://bit.ly/code-beast' />
        </WrapItem>
        <WrapItem>
          <Avatar name='Segun Adebayo' src='https://bit.ly/sage-adebayo' />
        </WrapItem>
      </Wrap>
      <Divider />
      <Flex
        bg='#edf3f8'
        _dark={{
          bg: "#3e3e3e",
        }}
        p={50}
        w='full'
        alignItems='center'
        justifyContent='center'
      >
        <Box
          mx='auto'
          px={8}
          py={4}
          rounded='lg'
          shadow='lg'
          bg='white'
          _dark={{
            bg: "gray.800",
          }}
          maxW='2xl'
        >
          <Flex minWidth='max-content' alignItems='center' gap='2'>
            <chakra.span
              fontSize='md'
              color='gray.600'
              _dark={{
                color: "gray.400",
              }}
            >
              Question 9 of 10
            </chakra.span>
            <Spacer />
            <Stat>
              <StatNumber>00:59</StatNumber>
            </Stat>
          </Flex>

          <Box mt={2}>
            <Text
              fontSize='2xl'
              color='gray.700'
              _dark={{
                color: "white",
              }}
              fontWeight='700'
              _hover={{
                color: "gray.600",
                _dark: {
                  color: "gray.200",
                },
                textDecor: "underline",
              }}
            >
              What year was the very first model of the iPhone released?
            </Text>
            <FormControl isRequired mt={2}>
              <FormLabel htmlFor='answer'>Answer</FormLabel>
              <Input id='answer' placeholder='Enter you answer here' />
            </FormControl>
          </Box>
          <Flex justifyContent='space-between' alignItems='center' mt={4}>
            <Button aria-label='Vote Up' fontSize={"2xl"} colorScheme={"green"}>
              👍
            </Button>
            <Button
              aria-label='Vote Down'
              fontSize={"2xl"}
              ml={2}
              colorScheme={"red"}
            >
              👎
            </Button>
            <Spacer />
            <Button colorScheme='blue'>Next</Button>
          </Flex>
        </Box>
      </Flex>
      ;
    </Container>
  );
};

export default Game;
