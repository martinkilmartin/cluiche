import { Question } from "./Question";

export type Game = {
  id: number;
  created_by: string;
  created_at: number;
  started_at: number | null;
  paused_at: number | null;
  ended_at: number | null;
  player_ids: Array<UUID>;
  kitty: Array<Kitty>;
  buy_in: number;
  rounds: Array<Round>;
};

type Kitty = UUID & {
  paid: number;
};

type UUID = {
  uuid: string;
};

type Round = {
  round: number;
  questions: Array<GameQuestion>;
};

type GameQuestion = Question & {
  answers: Array<Answer>;
};

type Answer = {
  uuid: string;
  answer: string | null;
  correct: boolean | null;
  score: number | null;
};
