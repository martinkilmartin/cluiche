import { Question } from "./Question";
import { UUID } from "./User";

export type Game = {
  id: number;
  created_by: string;
  created_at: number;
  started_at: number | null;
  paused_at: number | null;
  ended_at: number | null;
  players: Array<Player>;
  kitty: Array<Kitty>;
  buy_in: number;
  rounds: Array<Round>;
};

type Kitty = UUID & {
  paid: number;
};

type Round = {
  round: number;
  questions: Array<GameQuestion>;
};

type Player = UUID & {
  email?: string;
  username?: string;
  avatarURL?: string;
}

type GameQuestion = Question & {
  answers: Array<Answer>;
};

type Answer = {
  uuid: string;
  answer: string | null;
  correct: boolean | null;
  score: number | null;
};
