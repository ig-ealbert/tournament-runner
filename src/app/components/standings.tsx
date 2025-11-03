import { standingsProps } from "@/types/standingsProps";

export default function Standings(props: standingsProps) {
  return (
    <div>
      <h3>Current round: {props.round}</h3>
      <table>
        <thead>
          <tr>
            <th>Ranking</th>
            <th>Player Name</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Ties</th>
          </tr>
        </thead>
        <tbody>
          {props.players.map((player) => (
            <tr key={`standingsRow${player.id}`}>
              <td>DUNNO</td>
              <td>{player.name}</td>
              <td>{player.wins}</td>
              <td>{player.losses}</td>
              <td>{player.ties}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
