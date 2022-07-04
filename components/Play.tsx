import { useState, useEffect } from "react";
import { supabase } from "@services/supabase";
import { User, Game, Player, UserAccountType } from "../types";
import {
  Avatar,
  Box,
  Container,
  Heading,
  List,
  ListItem,
  Stat,
  StatLabel,
  StatNumber,
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
    setPlayers(foundPlayers)
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
      </Box>
    </Container>
  );
};

export default Play;
