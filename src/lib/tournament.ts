import { participant } from "@/types/participant";
import { result } from "@/types/result";
import { tournament } from "@/types/tournament";
import { tournamentStatus } from "@/types/tournamentStatus";
import { randomUUID } from "node:crypto";
import { WIN_SCORE } from "./constants";

export class Tournament {
  tournament: tournament = {
    id: randomUUID(),
    name: "New Tournament",
    participants: [],
    rounds: 0,
    currentRound: 0,
    results: [],
    status: tournamentStatus.SCHEDULED,
    standings: [],
  };

  addPlayer(playerName: string) {
    const playerInfo: participant = {
      name: playerName,
      id: this.tournament.participants.length + 1,
      wins: 0,
      losses: 0,
      ties: 0,
      opponents: [],
      score: 0,
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

  calculatePlayerScore(player: participant) {
    return player.wins * WIN_SCORE + player.ties;
  }

  calculateStandings() {
    for (const player of this.tournament.participants) {
      player.score = this.calculatePlayerScore(player);
    }
    this.tournament.standings = this.tournament.participants.sort(
      (a, b) => a.score - b.score
    );
    return this.tournament.standings;
  }

  getPlayerById(id: number) {
    return this.tournament.participants.filter((player) => player.id === id)[0];
  }

  getPlayers() {
    return this.tournament.participants;
  }

  givePlayerWin(id: number) {
    const player = this.getPlayerById(id);
    player.wins = player.wins + 1;
    return player.wins;
  }

  givePlayerLoss(id: number) {
    const player = this.getPlayerById(id);
    player.losses = player.losses + 1;
    return player.losses;
  }

  givePlayersTie(id1: number, id2: number) {
    const player1 = this.getPlayerById(id1);
    const player2 = this.getPlayerById(id2);
    player1.ties = player1.ties + 1;
    player2.ties = player2.ties + 1;
    return true;
  }

  makePairings() {
    if (this.tournament.status !== tournamentStatus.IN_PROGRESS) {
      this.tournament.status = tournamentStatus.IN_PROGRESS;
    }
    // TODO
  }

  reportResult(player1: number, player2: number, outcome: result) {
    if (outcome === result.WIN) {
      this.givePlayerWin(player1);
      this.givePlayerLoss(player2);
    } else if (outcome === result.LOSS) {
      this.givePlayerLoss(player1);
      this.givePlayerWin(player2);
    } else {
      this.givePlayersTie(player1, player2);
    }
    const resultLog = {
      player1,
      player2,
      round: this.tournament.currentRound,
      result: outcome,
      tournamentId: this.tournament.id,
    };
    this.tournament.results.push(resultLog);
    return outcome;
  }

  setName(name: string) {
    this.tournament.name = name;
    return name;
  }
}
