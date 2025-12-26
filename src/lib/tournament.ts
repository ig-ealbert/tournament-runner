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

  addResultToLog(player1: number, player2: number, outcome: result) {
    const resultLog = {
      player1,
      player2,
      round: this.tournament.currentRound,
      result: outcome,
      tournamentId: this.tournament.id,
    };
    this.tournament.results.push(resultLog);
    return resultLog;
  }

  advanceToNextRound() {
    if (this.tournament.currentRound + 1 <= this.tournament.rounds) {
      this.tournament.currentRound++;
    }
  }

  calculatePlayerScore(player: participant) {
    return player.wins * WIN_SCORE + player.ties;
  }

  calculateMaxRounds() {
    const numPlayers = this.tournament.participants.length;
    this.tournament.rounds = Math.ceil(Math.log2(numPlayers));
    return this.tournament.rounds;
  }

  calculateStandings() {
    if (this.tournament.currentRound === 0) {
      this.randomizePlayerOrder();
      this.tournament.status = tournamentStatus.IN_PROGRESS;
      this.calculateMaxRounds();
    }
    this.advanceToNextRound();
    for (const player of this.tournament.participants) {
      player.score = this.calculatePlayerScore(player);
    }
    this.tournament.standings = this.tournament.participants.sort(
      (a, b) => b.score - a.score
    );
    return this.tournament.standings;
  }

  getPlayerById(id: number) {
    return this.tournament.participants.filter((player) => player.id === id)[0];
  }

  getPlayers() {
    return this.tournament.participants;
  }

  getTournamentData() {
    if (
      this.tournament.currentRound !== 0 &&
      this.tournament.currentRound === this.tournament.rounds
    ) {
      this.tournament.status = tournamentStatus.COMPLETE;
    }
    return this.tournament;
  }

  givePlayerBye(id: number) {
    this.givePlayerWin(id);
    this.addResultToLog(id, -1, result.WIN);
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
    const pairings: participant[][] = [];
    this.calculateStandings();
    const playersToPair = this.tournament.standings.slice();
    while (playersToPair.length > 0) {
      if (playersToPair.length === 1) {
        this.givePlayerBye(playersToPair[0].id);
        pairings.push(playersToPair);
        break;
      }
      const playerAwaitingMatch = playersToPair.shift();
      if (!playerAwaitingMatch) {
        return; // This should never happen but TS
      }
      for (const [index, potentialPair] of playersToPair.entries()) {
        if (!potentialPair.opponents.includes(playerAwaitingMatch.id)) {
          pairings.push([playerAwaitingMatch, potentialPair]);
          playersToPair.splice(index, 1);
          break;
        }
        if (index === playersToPair.length - 1) {
          // throw new Error(`Unable to pair ${playerAwaitingMatch.name}`);
          pairings.push([playerAwaitingMatch, potentialPair]);
          playersToPair.splice(index, 1);
          break;
        }
      }
    }
    return pairings;
  }

  randomizePlayerOrder() {
    const playersToRandomize = this.tournament.participants.slice();
    const randomOrder = [];
    while (playersToRandomize.length > 0) {
      const numPlayers = playersToRandomize.length;
      const randomNumber = Math.floor(Math.random() * numPlayers);
      const randomPlayer = playersToRandomize[randomNumber];
      randomOrder.push(randomPlayer);
      playersToRandomize.splice(randomNumber, 1);
    }
    this.tournament.participants = randomOrder;
    return randomOrder;
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
    const participant1 = this.getPlayerById(player1);
    const participant2 = this.getPlayerById(player2);
    participant1.opponents.push(player2);
    participant2.opponents.push(player1);
    this.addResultToLog(player1, player2, outcome);
    return outcome;
  }

  setName(name: string) {
    this.tournament.name = name;
    return name;
  }
}
