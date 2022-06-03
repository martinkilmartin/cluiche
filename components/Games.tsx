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
  game: Game;
  data: UserAccountType;
  onDelete: () => void;
};
const Games = ({ user, data }: GamesProps): JSX.Element => {
  const [games, setGames] = useState<Game[] | null>(null);
  const format = (val: string) => `₿` + val;
  const parse = (val: string) => val.replace(/^\₿/, "");
  const [buyIn, setBuyIn] = useState("0.00000000");
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

  return (
    <Container centerContent width={"container.xl"}>
      <Heading>New Game</Heading>
      <Box>
        <FormControl isRequired isInvalid={errorText.length > 0}>
          <FormLabel htmlFor='buyIn'>Buy-In</FormLabel>
          <NumberInput
            onChange={(valueString) => setBuyIn(parse(valueString))}
            value={format(buyIn)}
            precision={8}
            step={0.00001234}
          >
            <NumberInputField id='buyIn' />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <Button>Create</Button>
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
