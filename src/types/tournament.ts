import { match } from "./match";
import { participant } from "./participant";
import { tournamentStatus } from "./tournamentStatus";

export type tournament = {
  id: string;
  name: string;
  participants: participant[];
  rounds: number;
  currentRound: number;
  results: match[];
  status: tournamentStatus;
};
