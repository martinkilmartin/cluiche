import { Question } from "./Question";

export type Game = {
  id: number;
  created_by: string;
  created_at: number;
  started_at: number | null;
  paused_at: number | null;
  ended_at: number | null;
  players: Record<string, Player>;
  kitty: Record<string, Kitty>;
  buy_in: number;
  rounds: Record<number, Round>;
};

export type Player = {
  name: string;
  avatar: string;
};

type Kitty = {
  paid: number;
};

type Round = {
  mc: string;
  round: number;
  questions: Record<number, GameQuestion>;
};

type GameQuestion = Question & {
  answers: Record<string, Answer>;
};

type Answer = {
  answer: string | null;
  correct: boolean | null;
  score: number | null;
};
