import { useState, useEffect } from "react";
import { supabase } from "@services/supabase";
import { User, Game, UserAccountType } from "../types";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spacer,
  Stat,
  StatNumber,
  Text,
  Wrap,
  WrapItem,
  chakra,
} from "@chakra-ui/react";

import { usaStates } from "@constants/usa-states";
import { euroCountries } from "@constants/euro-countries";

const MAX_Q = 10;

const usaEuSorted = sortData();

function sortData() {
  const usaSorted = usaStates.sort(
    (a, b) => (a[1] as number) - (b[1] as number)
  );
  usaSorted.forEach((usa) => usa.length === 2 && usa.push("🇺🇸"));

  const euSorted = euroCountries.sort(
    (a, b) => (a[1] as number) - (b[1] as number)
  );
  euSorted.forEach((eu) => eu.length === 2 && eu.push("🇪🇺"));

  const usaEuMerged = [...usaSorted, ...euSorted];

  const usaEuSorted = usaEuMerged.sort(
    (a, b) => (a[1] as number) - (b[1] as number)
  );
  return usaEuSorted;
}

function createQuestions() {
  const qashes = new Set();
  const qArray = new Array<Array<string>>();
  const answers = new Array<string>();
  let i = 0;
  while (qArray.length < MAX_Q && i < usaEuSorted.length) {
    const rando = Math.floor(Math.random() * usaEuSorted.length);
    //console.log(usaEuSorted[rando][0]);
    //console.log(findSmaller(rando, usaEuSorted[rando][2] as "🇺🇸" | "🇪🇺"));
    const smaller = findSmaller(rando, usaEuSorted[rando][2] as "🇺🇸" | "🇪🇺");
    const larger = findLarger(rando, usaEuSorted[rando][2] as "🇺🇸" | "🇪🇺");
    if (smaller && larger) {
      const flag = usaEuSorted[rando][2];
      const q = `What ${
        flag === "🇺🇸" ? "European country" : "US State (or Territory)"
      } is closest is size, either larger or smaller than ${
        usaEuSorted[rando][0]
      }?`;
      const a = `${larger[0]} is larger by ${
        larger[1] - (usaEuSorted[rando][1] as number)
      } and ${smaller[0]} is smaller by ${
        (usaEuSorted[rando][1] as number) - smaller[1]
      }.`;
      if (!qashes.has(q)) {
        qArray.push([q, a, `${larger[0]},${smaller[0]}`]);
        qashes.add(q);
        answers.push();
      }
    } else if (smaller || larger) {
      if (smaller) {
        const flag = usaEuSorted[rando][2];
        const q = `What ${
          flag === "🇺🇸" ? "European country" : "US State (or Territory)"
        } is closest is size, but smaller than ${usaEuSorted[rando][0]}?`;
        const a = `${smaller[0]}.`;
        if (!qashes.has(q)) {
          qArray.push([q, a, smaller[0]]);
          qashes.add(q);
        }
      }
      if (larger) {
        const flag = usaEuSorted[rando][2];
        const q = `What ${
          flag === "🇺🇸" ? "European country" : "US State (or Territory)"
        } is closest is size, but larger than ${usaEuSorted[rando][0]}?`;
        const a = `${larger[0]}.`;
        if (!qashes.has(q)) {
          qArray.push([q, a, larger[0]]);
          qashes.add(q);
        }
      }
    }
    i++;
  }
  return qArray;
}

function findSmaller(
  index: number,
  flag: "🇺🇸" | "🇪🇺"
): null | [string, number, "🇺🇸" | "🇪🇺"] {
  if (index < 1) {
    return null;
  } else if (usaEuSorted[index - 1][2] !== flag) {
    return usaEuSorted[index - 1] as [string, number, "🇺🇸" | "🇪🇺"];
  } else {
    return findSmaller(index - 1, flag);
  }
}

function findLarger(
  index: number,
  flag: "🇺🇸" | "🇪🇺"
): null | [string, number, "🇺🇸" | "🇪🇺"] {
  if (index >= usaEuSorted.length - 1) {
    return null;
  } else if (usaEuSorted[index + 1][2] !== flag) {
    return usaEuSorted[index + 1] as [string, number, "🇺🇸" | "🇪🇺"];
  } else {
    return findLarger(index + 1, flag);
  }
}
const qArray = createQuestions();

type GameProps = {
  user: User;
  data: UserAccountType | undefined;
};
const Game = ({ user, data }: GameProps): JSX.Element => {
  const [game, setGame] = useState<Game | null>(null);
  const [buyIn, setBuyIn] = useState(0);
  const [newGame, setNewGame] = useState("");
  const [errorText, setError] = useState<string | null>(null);
  const [successText, setSuccess] = useState<string | null>(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [qIndex, setQIndex] = useState(0);

  // useEffect(() => {
  //   fetchGame();
  // }, []);

  // const fetchGame = async () => {
  //   const { data: games, error } = await supabase
  //     .from("games")
  //     .select("*")
  //     .order("created_at", { ascending: true });
  //   if (error) console.error("error", error);
  //   else setGame(games[0]);
  // };

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

  const addAnswer = (a: string) => {
    setError(null);
    setSuccess(null);
    const myAnswer = a.trim().toLowerCase();
    const possibleAnswers = qArray[qIndex][2]
      .split(",")
      .map((e) => e.toLowerCase());
    console.log(myAnswer);
    console.log(possibleAnswers);
    if (possibleAnswers.includes(myAnswer)) {
      setSuccess(`${myAnswer} is correct! Well done!`);
      if (qIndex + 1 < qArray.length) {
        setQIndex(qIndex + 1);
      }
    } else {
      setError(`${myAnswer} is wrong! ❌!`);
    }
  };

  const giveUp = () => {
    setError(null);
    setSuccess(qArray[qIndex][1]);
    if (qIndex + 1 < qArray.length) {
      setQIndex(qIndex + 1);
    }  
  }

  return (
    <Box w='100%'>
      <Container centerContent>
        <Heading>Your Game Name</Heading>
        <Text>Some minor blah blah blah</Text>
        <Wrap p={5}>
          <WrapItem>
            <Avatar name='shark' src='/avatars/svg/050-shark.svg'>
              <AvatarBadge
                borderColor='greenyellow'
                boxSize='1em'
                bg='green.500'
              />
            </Avatar>
          </WrapItem>
          <WrapItem>
            <Avatar name='frog' src='/avatars/svg/049-frog.svg'>
              <AvatarBadge bg='green.500' boxSize='1em' />
            </Avatar>
          </WrapItem>
          <WrapItem>
            <Avatar name='worker' src='/avatars/svg/048-worker.svg'>
              <AvatarBadge borderColor='papayawhip' bg='tomato' boxSize='1em' />
            </Avatar>
          </WrapItem>
          <WrapItem>
            <Avatar name='zebra' src='/avatars/svg/047-zebra.svg'>
              <AvatarBadge borderColor='papayawhip' bg='tomato' boxSize='1em' />
            </Avatar>
          </WrapItem>
          <WrapItem>
            <Avatar name='vampire' src='/avatars/svg/046-vampire.svg'>
              <AvatarBadge borderColor='papayawhip' bg='tomato' boxSize='1em' />
            </Avatar>
          </WrapItem>
          <WrapItem>
            <Avatar name='giraffe' src='/avatars/svg/045-giraffe.svg'>
              <AvatarBadge borderColor='papayawhip' bg='tomato' boxSize='1em' />
            </Avatar>
          </WrapItem>
          <WrapItem>
            <Avatar name='officer' src='/avatars/svg/044-officer.svg'>
              <AvatarBadge borderColor='papayawhip' bg='tomato' boxSize='1em' />
            </Avatar>
          </WrapItem>
        </Wrap>
      </Container>
      <Flex
        bg='#edf3f8'
        _dark={{
          bg: "#3e3e3e",
        }}
        p={5}
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
        >
          <Flex minWidth='max-content' alignItems='center' gap='2'>
            <chakra.span
              fontSize='md'
              color='gray.600'
              _dark={{
                color: "gray.400",
              }}
            >
              {qArray?.length && `Question ${qIndex + 1} of ${qArray?.length}`}
            </chakra.span>
            <Spacer />
            <Stat>
              <StatNumber>
                {(errorText && errorText) || (successText && successText)}
              </StatNumber>
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
              {qArray[qIndex][0]}
            </Text>
            <FormControl isRequired mt={2}>
              <FormLabel htmlFor='answer'>Answer</FormLabel>
              <Input
                id='answer'
                placeholder='Enter you answer here'
                onChange={(e) => {
                  setNewAnswer(e.target.value);
                }}
              />
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
            <Button colorScheme='blue' onClick={() => giveUp()}>
              Give Up
            </Button>
            <Button colorScheme='blue' onClick={() => addAnswer(newAnswer)}>
              Next
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default Game;
