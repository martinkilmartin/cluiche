import { useState, useEffect } from "react";
import { supabase } from "@services/supabase";
import { User, Question as QuestionType } from "../types";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  Grid,
  GridItem,
  Spacer,
  Stack,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { AiFillEdit } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";

type QuestionsProps = {
  user: User;
};

type QuestionProps = {
  question: QuestionType;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const Questions = ({ user }: QuestionsProps): JSX.Element => {
  const bg = useColorModeValue("white", "gray.800");
  const bg2 = useColorModeValue("white", "gray.800");
  const bg3 = useColorModeValue("gray.100", "gray.700");
  const [questions, setQuestions] = useState<QuestionType[] | null>(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newClue, setNewClue] = useState("");
  const [tag, setTag] = useState("");
  const [errorText, setError] = useState("");

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

  const addQuestion = async (q: string, a: string, c: string, t: string) => {
    const question = q.trim();
    const answer = a.trim();
    const clue = c.trim();
    const tag = t.trim();
    if (question.length && answer.length) {
      setError("");
      const { data: questionBack, error } = await supabase
        .from("questions")
        .insert({ question, answer, clue, tag, user_id: user.id })
        .single();
      if (error) setError(error.message);
      else if (Array.isArray(questions)) {
        setQuestions([...questions, questionBack]);
        clear();
      }
    } else {
      setError(question.length ? "Freagra ag teastáil" : "Ceist ag teastáil");
    }
  };

  const clear = () => {
    setNewQuestion("");
    setNewAnswer("");
    setNewClue("");
    setTag("");
  };

  const handleDoubleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: number
  ) => {
    switch (e.detail) {
      case 1:
        return;
        break;
      case 2:
        deleteQuestion(id);
        return;
        break;
      case 3:
        return;
        break;
      default:
        return;
    }
  };

  const deleteQuestion = async (id: number) => {
    try {
      await supabase.from("questions").delete().eq("id", id);
      if (questions) setQuestions(questions.filter((x) => x.id != id));
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <Box w='100%'>
      <Container centerContent>
        <Heading>Add Question</Heading>
      </Container>
      <Box w='100%'>
        <FormControl isRequired isInvalid={errorText.length > 0}>
          <FormLabel
            fontSize='sm'
            fontWeight='md'
            color='gray.700'
            _dark={{
              color: "gray.50",
            }}
            htmlFor='question'
            srOnly={true}
          >
            Question
          </FormLabel>
          <InputGroup size='lg'>
            <InputLeftAddon
              bg='gray.50'
              _dark={{
                bg: "gray.800",
              }}
              color='gray.500'
              rounded='md'
            >
              Q
            </InputLeftAddon>
            <Input
              id='question'
              type='text'
              placeholder='Cé leis thú'
              value={newQuestion}
              onChange={(e) => {
                setNewQuestion(e.target.value);
              }}
              focusBorderColor='green.400'
              rounded='md'
            />
          </InputGroup>
        </FormControl>
        <FormControl isRequired isInvalid={errorText.length > 0}>
          <FormLabel
            fontSize='sm'
            fontWeight='md'
            color='gray.700'
            _dark={{
              color: "gray.50",
            }}
            htmlFor='answer'
            srOnly={true}
          >
            Answer
          </FormLabel>
          <InputGroup size='lg'>
            <InputLeftAddon
              bg='gray.50'
              _dark={{
                bg: "gray.800",
              }}
              color='gray.500'
              rounded='md'
            >
              A
            </InputLeftAddon>
            <Input
              id='answer'
              type='text'
              placeholder='Liom fhéin.'
              value={newAnswer}
              onChange={(e) => {
                setNewAnswer(e.target.value);
              }}
              focusBorderColor='green.400'
              rounded='md'
            />
          </InputGroup>
          {errorText.length > 0 ? (
            <FormHelperText>{"Add a question and answer"}</FormHelperText>
          ) : (
            <FormErrorMessage>{errorText}</FormErrorMessage>
          )}
        </FormControl>
        <Flex justifyContent='space-between' alignItems='center' mt={4}>
          <Button
            onClick={() => clear()}
            aria-label='Clear Q &amp; A'
            colorScheme={"yellow"}
          >
            Clear
          </Button>
          <Spacer />
          <Button
            onClick={() => addQuestion(newQuestion, newAnswer, newClue, tag)}
            aria-label='Add Q &amp; A'
            colorScheme={"green"}
          >
            Add
          </Button>
        </Flex>
      </Box>
      <Container centerContent>
        <Heading mt={4}>Your Questions</Heading>
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
        <Stack
          direction={{
            base: "column",
          }}
          w='full'
          bg={{
            md: bg,
          }}
          shadow='lg'
        >
          <Flex direction={"column"} bg={bg2}>
            {questions?.length &&
              questions.map((question, qid) => {
                return (
                  <Question
                    key={question.id}
                    question={question}
                    onDelete={(e) => handleDoubleClick(e, question.id)}
                  />
                );
              })}
          </Flex>
        </Stack>
      </Flex>
    </Box>
  );
};

const Question = ({ question, onDelete }: QuestionProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newQuestion, setNewQuestion] = useState(question.question);
  const [newAnswer, setNewAnswer] = useState(question.answer);
  const [isUpdated, setIsCompleted] = useState(false);
  const [errorText, setError] = useState("");
  const [updatedQ, setUpdatedQ] = useState(question.question);

  const editQuestion = async (q: string, a: string) => {
    setIsCompleted(false);
    const qTrim = q.trim();
    const aTrim = a.trim();
    if (qTrim.length && aTrim.length) {
      setError("");
      const { data, error } = await supabase
        .from("questions")
        .update({ question: qTrim, answer: aTrim })
        .eq("id", question.id);
      if (error) {
        setError(error.message);
      }
      setIsCompleted(true);
      setTimeout(() => onClose(), 1_234);
      setTimeout(() => setIsCompleted(false), 1_234);
      setUpdatedQ(qTrim);
    } else {
      setError(qTrim.length ? "Freagra ag teastáil" : "Ceist ag teastáil");
    }
  };

  return (
    <Flex w='100%' p={2}>
      <Grid
        templateColumns='repeat(5, 1fr)'
        w='full'
        fontWeight='hairline'
        key={question.id}
      >
        <GridItem colSpan={4}>{updatedQ}</GridItem>
        <GridItem colSpan={1}>
          <Flex justify={"end"}>
            <ButtonGroup variant='solid' size='sm' spacing={3}>
              <IconButton
                colorScheme='green'
                icon={<AiFillEdit />}
                aria-label='Edit'
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onOpen();
                }}
              />
              <IconButton
                colorScheme='red'
                variant='outline'
                icon={<BsFillTrashFill />}
                aria-label='Delete'
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(e);
                }}
              />
            </ButtonGroup>
          </Flex>
        </GridItem>
      </Grid>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Question</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired isInvalid={errorText.length > 0}>
              <FormLabel
                fontSize='sm'
                fontWeight='md'
                color='gray.700'
                _dark={{
                  color: "gray.50",
                }}
                htmlFor='question'
                srOnly={true}
              >
                Question
              </FormLabel>
              <InputGroup size='lg'>
                <InputLeftAddon
                  bg='gray.50'
                  _dark={{
                    bg: "gray.800",
                  }}
                  color='gray.500'
                  rounded='md'
                >
                  Q
                </InputLeftAddon>
                <Input
                  id='question'
                  type='text'
                  placeholder='Cé leis thú'
                  value={newQuestion}
                  onChange={(e) => {
                    setNewQuestion(e.target.value);
                  }}
                  focusBorderColor='green.400'
                  rounded='md'
                />
              </InputGroup>
            </FormControl>
            <FormControl isRequired isInvalid={errorText.length > 0}>
              <FormLabel
                fontSize='sm'
                fontWeight='md'
                color='gray.700'
                _dark={{
                  color: "gray.50",
                }}
                htmlFor='answer'
                srOnly={true}
              >
                Answer
              </FormLabel>
              <InputGroup size='lg'>
                <InputLeftAddon
                  bg='gray.50'
                  _dark={{
                    bg: "gray.800",
                  }}
                  color='gray.500'
                  rounded='md'
                >
                  A
                </InputLeftAddon>
                <Input
                  id='answer'
                  type='text'
                  placeholder='Liom fhéin.'
                  value={newAnswer}
                  onChange={(e) => {
                    setNewAnswer(e.target.value);
                  }}
                  focusBorderColor='green.400'
                  rounded='md'
                />
              </InputGroup>
              {errorText.length > 0 ? (
                <FormHelperText>{"Add a question and answer"}</FormHelperText>
              ) : (
                <FormErrorMessage>{errorText}</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme={isUpdated ? "green" : "blue"}
              mr={3}
              onClick={() => editQuestion(newQuestion, newAnswer)}
            >
              {isUpdated ? "Success!" : "Save"}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Questions;
