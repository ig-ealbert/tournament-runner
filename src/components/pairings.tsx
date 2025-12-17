import { pairingsProps } from "@/types/pairingsProps";
import { participant } from "@/types/participant";
import { result } from "@/types/result";
import React, { useRef } from "react";

export default function Pairings(props: pairingsProps) {
  const [isReportingResult, setIsReportingResult] =
    React.useState<boolean>(false);
  const [resultPlayers, setResultPlayers] = React.useState<participant[]>([]);
  const [resultOutcome, setResultOutcome] = React.useState<string>(result.WIN);
  const [reportedMatches, setReportedMatches] = React.useState<number[]>([]);
  React.useEffect(() => {
    setReportedMatches([]);
  }, [props]);

  function handleResultWinnerChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setResultOutcome(event.target.value);
  }

  function openReportingModal(pair: participant[], index: number) {
    setResultPlayers(pair);
    setIsReportingResult(true);
    const addReport = reportedMatches.slice();
    addReport.push(index);
    setReportedMatches(addReport);
  }

  async function reportResult() {
    await fetch("/api/results/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        player1: resultPlayers[0].id,
        player2: resultPlayers[1].id,
        outcome: resultOutcome,
      }),
    });
    setIsReportingResult(false);
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Player 1</th>
            <th>Player 2</th>
            <th>Report Result</th>
          </tr>
        </thead>
        <tbody>
          {props.pairings.map((pair, index) => (
            <tr key={`pairingsRow${index}`}>
              <td>{pair[0].name}</td>
              <td>{pair[1].name}</td>
              <td>
                <button
                  onClick={() => openReportingModal(pair, index)}
                  disabled={reportedMatches.includes(index)}
                >
                  Report Result
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isReportingResult && (
        <div id="reportDialog">
          Select Winner:
          <select value={resultOutcome} onChange={handleResultWinnerChange}>
            <option value={result.WIN}>{resultPlayers[0].name}</option>
            <option value={result.LOSS}>{resultPlayers[1].name}</option>
            <option value={result.TIE}>Tie</option>
          </select>
          <button onClick={reportResult}>Report Result</button>
        </div>
      )}
    </div>
  );
}
