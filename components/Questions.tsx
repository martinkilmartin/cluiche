import { useState, useEffect } from "react";
import { supabase } from "@services/supabase";
import { User, Question as QuestionType } from "../types";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  List,
  ListIcon,
  ListItem,
  Spacer,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

type QuestionsProps = {
  user: User;
};
type QuestionProps = {
  question: QuestionType;
  onDelete: () => void;
};
const Questions = ({ user }: QuestionsProps): JSX.Element => {
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

  const deleteQuestion = async (id: number) => {
    try {
      await supabase.from("questions").delete().eq("id", id);
      if (questions) setQuestions(questions.filter((x) => x.id != id));
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <Container centerContent>
      <Heading>Add Question</Heading>
      <Box>
        <FormControl isRequired isInvalid={errorText.length > 0}>
          <FormLabel
            fontSize='sm'
            fontWeight='md'
            color='gray.700'
            _dark={{
              color: "gray.50",
            }}
            htmlFor='question'
          >
            Question
          </FormLabel>
          <InputGroup size='sm'>
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
            <InputRightAddon
              bg='gray.50'
              _dark={{
                bg: "gray.800",
              }}
              color='gray.500'
              rounded='md'
            >
              ?
            </InputRightAddon>
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
          >
            Answer
          </FormLabel>
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
      <Heading>Your Questions</Heading>
      <Box>
        <List spacing={3}>
          {questions?.length &&
            questions.map((question) => (
              <Question
                key={question.id}
                question={question}
                onDelete={() => deleteQuestion(question.id)}
              />
            ))}
        </List>
      </Box>
    </Container>
  );
};

const Question = ({ question, onDelete }: QuestionProps) => {
  const [isAnswered, setIsCompleted] = useState(question.is_answered);

  const toggle = async () => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .update({ is_answered: !isAnswered })
        .eq("id", question.id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      setIsCompleted(data.is_answered);
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <ListItem>
      <Flex>
        <Checkbox
          mr='1'
          onChange={(_e) => toggle()}
          checked={isAnswered ? true : false}
        />
        <Box>
          <details>
            <summary>{question.question}</summary>
            {question.answer}
          </details>
        </Box>
        <Spacer />
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }}
        >
          ❌
        </Button>
      </Flex>
    </ListItem>
  );
};

export default Questions;
