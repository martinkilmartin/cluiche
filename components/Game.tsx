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
  Icon,
  Input,
  Spacer,
  Stat,
  StatNumber,
  Text,
  useDisclosure,
  Wrap,
  WrapItem,
  chakra,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import {
  AiFillCheckCircle,
  AiFillInfoCircle,
  AiFillWarning,
  AiFillCloseSquare,
  AiOutlineThunderbolt,
} from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";

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
        flag === "🇺🇸" ? " 🇪🇺 European country" : " 🇺🇸 US State (or Territory)"
      } is closest is size, either larger or smaller, to ${
        usaEuSorted[rando][0]
      }?`;
      const a = `${larger[0]} is larger than ${
        usaEuSorted[rando][0]
      } by ${new Intl.NumberFormat().format(
        larger[1] - (usaEuSorted[rando][1] as number)
      )} km2, and ${smaller[0]} is smaller by ${new Intl.NumberFormat().format(
        (usaEuSorted[rando][1] as number) - smaller[1]
      )} km2.`;
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

let qArray = createQuestions();

type GameProps = {
  user: User;
  data: UserAccountType | undefined;
};
const Game = ({ user, data }: GameProps): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [game, setGame] = useState<Game | null>(null);
  const [buyIn, setBuyIn] = useState(0);
  const [newGame, setNewGame] = useState("");
  const [errorText, setError] = useState<string | null>(null);
  const [successText, setSuccess] = useState<string | null>(null);
  const [infoText, setInfo] = useState<string | null>(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [gameOver, setGameOver] = useState<string | null>(null);

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
    setInfo(null);
    setSuccess(null);
    setGameOver(null);
    const myAnswer = a.trim().toLowerCase();
    const possibleAnswers = qArray[qIndex][2]
      .split(",")
      .map((e) => e.toLowerCase());
    if (possibleAnswers.includes(myAnswer)) {
      setSuccess(`${a} is correct! Well done!`);
      setScore(score + 1);
      if (qIndex + 1 < qArray.length) {
        setQIndex(qIndex + 1);
      }
    } else {
      myAnswer.length
        ? setError(`${a} is wrong!`)
        : setError("You need to [Give Up] or write an answer.");
    }
    if (score + skipped === qArray.length) {
      showResults();
    }
  };

  const giveUp = () => {
    setError(null);
    setSuccess(null);
    setGameOver(null);
    setInfo(qArray[qIndex][1]);
    setSkipped(skipped + 1);
    if (qIndex + 1 < qArray.length) {
      setQIndex(qIndex + 1);
    }
    if (score + skipped === qArray.length) {
      showResults();
    }
  };

  function showResults() {
    setError(null);
    setSuccess(null);
    setInfo(null);
    setGameOver(
      `Congrats on reaching the end! You skipped ${skipped} question${
        skipped > 1 ? "s" : ""
      } and answered ${score} correctly!`
    );
    setTimeout(() => resetGame(), 4_321);
  }

  function resetGame() {
    setError(null);
    setSuccess(null);
    setInfo(null);
    setGameOver(null);
    setSkipped(0);
    setScore(0);
    setQIndex(0);
    setNewAnswer("");
    qArray = createQuestions();
  }

  return (
    <Box w='100%'>
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
            <Button
              colorScheme='blue'
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onOpen();
                giveUp();
              }}
            >
              Give Up
            </Button>
            <Button
              colorScheme='blue'
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onOpen();
                addAnswer(newAnswer);
              }}
            >
              Next
            </Button>
          </Flex>
        </Box>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {(errorText && <MyAlert type='Error' message={errorText} />) ||
              (successText && (
                <MyAlert type='Sucess' message={successText} />
              )) ||
              (infoText && <MyAlert type='Info' message={infoText} />) ||
              (gameOver && <MyAlert type='Sucess' message={gameOver} />)}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

type AlertProps = {
  type: "Sucess" | "Info" | "Warning" | "Wrong" | "Error";
  message: string;
};

const colorMap = {
  Sucess: ["green.500", "green.400"],
  Info: ["blue.500", "blue.400"],
  Warning: ["yellow.400", "yellow.300"],
  Wrong: ["orange.400", "orange.300"],
  Error: ["red.500", "red.400"],
};

const iconMap = {
  Sucess: AiFillCheckCircle,
  Info: AiFillInfoCircle,
  Warning: AiFillWarning,
  Wrong: AiFillCloseSquare,
  Error: AiOutlineThunderbolt,
};

const MyAlert = ({ type, message }: AlertProps) => (
  <Flex
    maxW='sm'
    w='full'
    mx='auto'
    bg='white'
    _dark={{
      bg: "gray.800",
    }}
    rounded='lg'
    overflow='hidden'
  >
    <Flex
      justifyContent='center'
      alignItems='center'
      w={12}
      bg={colorMap[type][0]}
    >
      <Icon as={iconMap[type]} color='white' boxSize={6} />
    </Flex>

    <Box mx={-3} py={2} px={4}>
      <Box mx={3}>
        <chakra.span
          color={colorMap[type][0]}
          _dark={{
            color: colorMap[type][1],
          }}
          fontWeight='bold'
        >
          {type}
        </chakra.span>
        <chakra.p
          color='gray.600'
          _dark={{
            color: "gray.200",
          }}
          fontSize='sm'
        >
          {message}
        </chakra.p>
      </Box>
    </Box>
  </Flex>
);
export default Game;
