import { describe, it } from "@jest/globals";
import assert from "node:assert";
import { Tournament } from "./tournament";
import { result } from "@/types/result";
import { tournamentStatus } from "@/types/tournamentStatus";

describe("Tournament methods", () => {
  it("Constructs a new tournament", () => {
    const tournament = new Tournament();
    assert.ok(tournament);
  });

  it("Adds a player", () => {
    const tournament = new Tournament();
    const player = tournament.addPlayer("Player 1");
    assert.strictEqual(tournament.getPlayers().length, 1);
    assert.strictEqual(player.losses, 0);
    assert.strictEqual(player.wins, 0);
    assert.strictEqual(player.ties, 0);
    assert.strictEqual(player.name, "Player 1");
    assert.strictEqual(player.id, 1);
    assert.strictEqual(player.score, 0);
    assert.strictEqual(player.opponents.length, 0);
  });

  it("Logs result", () => {
    const tournament = new Tournament();
    const log = tournament.addResultToLog(1, 2, result.WIN);
    assert.strictEqual(log.player1, 1);
    assert.strictEqual(log.player2, 2);
    assert.strictEqual(log.result, result.WIN);
    assert.strictEqual(log.round, 0);
    assert.ok(log.tournamentId);
  });

  it("Calculates player score", () => {
    const tournament = new Tournament();
    const player1 = tournament.addPlayer("Player 1");
    tournament.addPlayer("Player 2");
    tournament.givePlayerWin(1);
    tournament.givePlayerLoss(1);
    tournament.givePlayersTie(1, 2);
    const score = tournament.calculatePlayerScore(player1);
    assert.strictEqual(score, 4);
  });

  it("Calculates max rounds", () => {
    const tournament = new Tournament();
    tournament.addPlayer("Player 1");
    tournament.addPlayer("Player 2");
    tournament.addPlayer("Player 3");
    tournament.addPlayer("Player 4");
    let rounds = tournament.calculateMaxRounds();
    assert.strictEqual(rounds, 2);
    tournament.addPlayer("Player 5");
    rounds = tournament.calculateMaxRounds();
    assert.strictEqual(rounds, 3);
    tournament.addPlayer("Player 6");
    tournament.addPlayer("Player 7");
    tournament.addPlayer("Player 8");
    tournament.addPlayer("Player 9");
    rounds = tournament.calculateMaxRounds();
    assert.strictEqual(rounds, 4);
  });

  it("Calculates standings", () => {
    const tournament = new Tournament();
    tournament.addPlayer("Player 1");
    tournament.addPlayer("Player 2");
    tournament.addPlayer("Player 3");
    tournament.addPlayer("Player 4");
    const standings = tournament.calculateStandings();
    assert.strictEqual(standings.length, 4);
  });

  it("Gets player by id", () => {
    const tournament = new Tournament();
    tournament.addPlayer("Player 1");
    const player = tournament.getPlayerById(1);
    assert.strictEqual(player.name, "Player 1");
    assert.strictEqual(player.id, 1);
  });

  it("Gets players", () => {
    const tournament = new Tournament();
    tournament.addPlayer("Player 1");
    tournament.addPlayer("Player 2");
    const players = tournament.getPlayers();
    assert.strictEqual(players.length, 2);
  });

  it("Gets tournament data", () => {
    const tournament = new Tournament();
    const data = tournament.getTournamentData();
    assert.strictEqual(data.currentRound, 0);
    assert.strictEqual(data.name, "New Tournament");
    assert.strictEqual(data.participants.length, 0);
    assert.strictEqual(data.results.length, 0);
    assert.strictEqual(data.rounds, 0);
    assert.strictEqual(data.standings.length, 0);
    assert.strictEqual(data.status, tournamentStatus.SCHEDULED);
  });

  it("Gives player bye", () => {
    const tournament = new Tournament();
    const player1 = tournament.addPlayer("Player 1");
    tournament.givePlayerBye(1);
    assert.strictEqual(player1.wins, 1);
    assert.strictEqual(player1.losses, 0);
    assert.strictEqual(player1.ties, 0);
  });

  it("Gives player win", () => {
    const tournament = new Tournament();
    const player1 = tournament.addPlayer("Player 1");
    tournament.givePlayerWin(1);
    assert.strictEqual(player1.wins, 1);
    assert.strictEqual(player1.losses, 0);
    assert.strictEqual(player1.ties, 0);
  });

  it("Gives player loss", () => {
    const tournament = new Tournament();
    const player1 = tournament.addPlayer("Player 1");
    tournament.givePlayerLoss(1);
    assert.strictEqual(player1.wins, 0);
    assert.strictEqual(player1.losses, 1);
    assert.strictEqual(player1.ties, 0);
  });

  it("Gives players tie", () => {
    const tournament = new Tournament();
    const player1 = tournament.addPlayer("Player 1");
    const player2 = tournament.addPlayer("Player 2");
    tournament.givePlayersTie(1, 2);
    assert.strictEqual(player1.wins, 0);
    assert.strictEqual(player1.losses, 0);
    assert.strictEqual(player1.ties, 1);
    assert.strictEqual(player2.wins, 0);
    assert.strictEqual(player2.losses, 0);
    assert.strictEqual(player2.ties, 1);
  });

  it("Reports result as win", () => {
    const tournament = new Tournament();
    const player1 = tournament.addPlayer("Player 1");
    const player2 = tournament.addPlayer("Player 2");
    const outcome = tournament.reportResult(1, 2, result.WIN);
    assert.strictEqual(outcome, result.WIN);
    assert.strictEqual(player1.wins, 1);
    assert.strictEqual(player1.losses, 0);
    assert.strictEqual(player1.ties, 0);
    assert.strictEqual(player2.wins, 0);
    assert.strictEqual(player2.losses, 1);
    assert.strictEqual(player2.ties, 0);
    assert.ok(player1.opponents.includes(2));
    assert.ok(player2.opponents.includes(1));
  });

  it("Reports result as loss", () => {
    const tournament = new Tournament();
    const player1 = tournament.addPlayer("Player 1");
    const player2 = tournament.addPlayer("Player 2");
    const outcome = tournament.reportResult(1, 2, result.LOSS);
    assert.strictEqual(outcome, result.LOSS);
    assert.strictEqual(player1.wins, 0);
    assert.strictEqual(player1.losses, 1);
    assert.strictEqual(player1.ties, 0);
    assert.strictEqual(player2.wins, 1);
    assert.strictEqual(player2.losses, 0);
    assert.strictEqual(player2.ties, 0);
    assert.ok(player1.opponents.includes(2));
    assert.ok(player2.opponents.includes(1));
  });

  it("Reports result as tie", () => {
    const tournament = new Tournament();
    const player1 = tournament.addPlayer("Player 1");
    const player2 = tournament.addPlayer("Player 2");
    const outcome = tournament.reportResult(1, 2, result.TIE);
    assert.strictEqual(outcome, result.TIE);
    assert.strictEqual(player1.wins, 0);
    assert.strictEqual(player1.losses, 0);
    assert.strictEqual(player1.ties, 1);
    assert.strictEqual(player2.wins, 0);
    assert.strictEqual(player2.losses, 0);
    assert.strictEqual(player2.ties, 1);
    assert.ok(player1.opponents.includes(2));
    assert.ok(player2.opponents.includes(1));
  });

  it("Sets name of tournament", () => {
    const tournament = new Tournament();
    const name = tournament.setName("The Tournament");
    assert.strictEqual(name, "The Tournament");
  });
});
