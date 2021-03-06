import { useEffect, useState } from "react";
import { User, UserAccountType } from "../types";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Spacer,
  Text,
  useDisclosure,
  chakra,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import {
  AiFillCheckCircle,
  AiFillInfoCircle,
  AiFillWarning,
  AiFillCloseSquare,
  AiOutlineThunderbolt,
} from "react-icons/ai";


import createQuestions from "@utils/qwizzerr";

let qArray = createQuestions();

const Game = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [buyIn, setBuyIn] = useState(0);
  const [newGame, setNewGame] = useState("");
  const [errorText, setError] = useState<string | null>(null);
  const [successText, setSuccess] = useState<string | null>(null);
  const [infoText, setInfo] = useState<string | null>(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [gameOver, setGameOver] = useState<string | null>(null);

  useEffect(() => {
    function showResults() {
      setError(null);
      setSuccess(null);
      setInfo(null);
      setGameOver(
        `Congrats on reaching the end! You skipped ${skipped} question${
          skipped > 1 ? "s" : ""
        } and answered ${score} correctly! Another round will begin in 5 . 4 . 3 . . .`
      );
      setTimeout(() => resetGame(), 4_321);
      setTimeout(() => onClose(), 3_210);
    }
    if (qArray.length && score + skipped + wrong === qArray.length) {
      showResults();
    }
  }, [onClose, score, skipped, wrong]);

  // const fetchGame = async () => {
  //   const { data: games, error } = await supabase
  //     .from("games")
  //     .select("*")
  //     .order("created_at", { ascending: true });
  //   if (error) console.error("error", error);
  //   else setGame(games[0]);
  // };

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
      setQIndex(qIndex + 1);
    } else {
      if (myAnswer.length) {
        setError(`${a} is wrong!`);
        setWrong(wrong + 1);
        setQIndex(qIndex + 1);
      } else {
        setError("Write an answer or press [Give Up]");
      }
    }
  };

  const giveUp = () => {
    setError(null);
    setSuccess(null);
    setGameOver(null);
    setInfo(qArray[qIndex][1]);
    setSkipped(skipped + 1);
    setQIndex(qIndex + 1);
  };

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
      {qArray[qIndex] && (
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
                {qArray?.length &&
                  `Question ${qIndex + 1} of ${qArray?.length}`}
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
              <Button
                aria-label='Vote Up'
                fontSize={"2xl"}
                colorScheme={"green"}
              >
                ???
              </Button>
              <Button
                aria-label='Vote Down'
                fontSize={"2xl"}
                ml={2}
                colorScheme={"red"}
              >
                ???
              </Button>
              <Spacer />
              <Button
                colorScheme='orange'
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
                ml={2}
                colorScheme='blue'
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onOpen();
                  addAnswer(newAnswer);
                }}
              >
                Submit
              </Button>
            </Flex>
          </Box>
        </Flex>
      )}
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
