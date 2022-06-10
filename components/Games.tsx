import { useState, useEffect } from "react";
import { supabase } from "@services/supabase";
import { User, Game, UserAccountType } from "../types";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
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
} from "@chakra-ui/react";

type GamesProps = {
  user: User;
  data: UserAccountType | undefined;
};
const Games = ({ user, data }: GamesProps): JSX.Element => {
  const [games, setGames] = useState<Game[] | null>(null);
  const [buyIn, setBuyIn] = useState(0);
  const [newGame, setNewGame] = useState("");
  const [errorText, setError] = useState("");

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    const { data: games, error } = await supabase
      .from("games")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) console.error("error", error);
    else setGames(games);
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
      <Heading>New Game</Heading>
      <Box>
        <HStack>
          <Text fontSize='2xl'>
            <br />₿
          </Text>
          <FormControl isRequired isInvalid={errorText.length > 0}>
            <FormLabel htmlFor='buyIn'>Buy-In</FormLabel>
            <NumberInput
              onChange={(_str, num) => buyInWrap(num)}
              value={buyIn}
              precision={8}
              step={0.00001234}
              min={0}
            >
              <NumberInputField id='buyIn' />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {errorText.length > 0 ? (
              <FormHelperText>
                {"Enter a buy-in amount of 0 or more"}
              </FormHelperText>
            ) : (
              <FormErrorMessage>{errorText}</FormErrorMessage>
            )}
          </FormControl>
        </HStack>
        <FormControl>
          <FormLabel htmlFor='invites'>Invite players by email</FormLabel>
          <Input placeholder='Enter email address(es)' size='md' />
          <FormHelperText>
            Separate multiple emails, with a comma.
          </FormHelperText>
        </FormControl>
        <Button onClick={() => createNewGame()}>Create</Button>
      </Box>
      <Divider />
      <Heading>Your Games</Heading>
      <Box>
        <List spacing={3}>
          {games?.length &&
            games.map((game) => {
              const gameStatus =
                game.started_at !== null
                  ? game.ended_at === null
                    ? "⚡ In Play"
                    : "🏁 Ended"
                  : "✨ New";
              return (
                <ListItem key={game.id}>
                  <Stat>
                    <StatLabel>Game #: {game.id}</StatLabel>
                    <StatNumber>Status: {gameStatus}</StatNumber>
                    <StatHelpText>
                      {game.started_at === null ? "yes" : "no"}
                    </StatHelpText>
                  </Stat>
                </ListItem>
              );
            })}
        </List>
      </Box>
    </Container>
  );
};

export default Games;
