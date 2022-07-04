import { useState, useEffect } from "react";
import { supabase } from "@services/supabase";
import {
  User,
  Game,
  Player,
  UserAccountType,
  Question as QuestionType,
} from "../types";
import {
  Box,
  Container,
  Divider,
  Heading,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

type PlayProps = {
  user: User;
  data: UserAccountType | undefined;
};
const Play = ({ user }: PlayProps): JSX.Element => {
  const [games, setGames] = useState<Game[] | null>(null);
  const [players, setPlayers] = useState<Player[] | null>(null);
  const [questions, setQuestions] = useState<QuestionType[] | null>(null);
  const [errorText, setError] = useState("");

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const { data: questions, error } = await supabase
      .from("questions")
      .select("*")
      .order("id", { ascending: true });
    if (error) console.error("error", error);
    else setQuestions(questions);
  };

  const fetchGames = async () => {
    const { data: games, error } = await supabase
      .from("games")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) console.error("error", error);
    else {
      setGames(games);
      findPlayers(games[0]);
    }
  };

  function findPlayers(game: Game) {
    const foundPlayers: any = [];
    Object.entries(game.players).forEach((p) => {
      foundPlayers.push(p[1]);
    });
    setPlayers(foundPlayers);
  }

  return (
    <Container centerContent width={"container.xl"}>
      <Heading>Game</Heading>
      <Box>
        <Wrap spacing={3}>
          {players?.length &&
            players.map((player, index) => (
              <WrapItem key={index}>
                <Text fontSize='6xl'>{player.avatar}</Text>
              </WrapItem>
            ))}
        </Wrap>
        <Divider />
        <Heading mt={4}>You have {questions?.length} Questions</Heading>
      </Box>
    </Container>
  );
};

export default Play;
