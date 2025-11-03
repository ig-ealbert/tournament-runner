import { participant } from "@/types/participant";
import { result } from "@/types/result";
import { tournament } from "@/types/tournament";
import { tournamentStatus } from "@/types/tournamentStatus";
import { randomUUID } from "node:crypto";

export class Tournament {
  tournament: tournament = {
    id: randomUUID(),
    name: "New Tournament",
    participants: [],
    rounds: 0,
    currentRound: 0,
    results: [],
    status: tournamentStatus.SCHEDULED,
  };

  addPlayer(playerName: string) {
    const playerInfo: participant = {
      name: playerName,
      id: this.tournament.participants.length + 1,
      wins: 0,
      losses: 0,
      ties: 0,
      opponents: [],
    };
    this.tournament.participants.push(playerInfo);
    return playerInfo;
  }

  advanceToNextRound() {
    if (this.tournament.currentRound + 1 <= this.tournament.rounds) {
      this.tournament.currentRound++;
    } else {
      this.tournament.status = tournamentStatus.COMPLETE;
    }
  }

  getPlayers() {
    return this.tournament.participants;
  }

  makePairings() {
    if (this.tournament.status !== tournamentStatus.IN_PROGRESS) {
      this.tournament.status = tournamentStatus.IN_PROGRESS;
    }
    // TODO
  }

  reportResult(player1: number, player2: number, outcome: result) {
    const result = {
      player1,
      player2,
      round: this.tournament.currentRound,
      result: outcome,
      tournamentId: this.tournament.id,
    };
    this.tournament.results.push(result);
    return result;
  }

  setName(name: string) {
    this.tournament.name = name;
    return name;
  }
}
