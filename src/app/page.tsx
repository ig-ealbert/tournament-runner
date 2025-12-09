"use client";

import { useState } from "react";
import Standings from "../components/standings";
import styles from "./page.module.css";
import { participant } from "@/types/participant"; // will likely need in the future
import { tournament } from "@/types/tournament";
import { tournamentStatus } from "@/types/tournamentStatus";
import Pairings from "@/components/pairings";

const emptyTournament = {
  id: "New Tournament",
  name: "New Tournament",
  participants: [],
  rounds: 0,
  currentRound: 0,
  results: [],
  standings: [],
  status: tournamentStatus.SCHEDULED,
};

export default function Home() {
  const [tournamentData, setTournamentData] =
    useState<tournament>(emptyTournament);

  const [addPlayerValue, setAddPlayerValue] = useState<string>("");

  async function addPlayer() {
    try {
      const returnValue = await fetch("/api/players/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playerName: addPlayerValue }),
      });
      const newPlayer = await returnValue.json();
      const newPlayerList = tournamentData.participants.slice();
      newPlayerList.push(newPlayer);
      const newStandings = tournamentData.standings.slice();
      newStandings.push(newPlayer);

      setTournamentData({
        ...tournamentData,
        participants: newPlayerList,
        standings: newStandings,
      });
    } catch (e) {
      console.log(`Unable to add player.  ${e}`);
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className="topCenter">
          <input
            className="tournamentName"
            value={tournamentData.name}
            onChange={(event) =>
              setTournamentData({ ...tournamentData, name: event.target.value })
            }
          ></input>
          <div id="addPlayerSection">
            <input
              id="newPlayerName"
              placeholder="Enter Player Name"
              value={addPlayerValue}
              onChange={(e) => setAddPlayerValue(e.target.value)}
            ></input>
            <button onClick={addPlayer}>Add Player</button>
          </div>
          <button>
            Create Pairings (Round {tournamentData.currentRound + 1})
          </button>
        </div>
        <div className="sideBySide">
          <div id="pairingsSection" className="column">
            <Pairings round={tournamentData.currentRound} pairings={[]} />
          </div>
          <div id="standingsSection" className="column">
            <Standings
              standings={tournamentData.participants}
              round={tournamentData.currentRound}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
