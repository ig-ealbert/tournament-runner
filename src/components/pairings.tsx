import { pairingsProps } from "@/types/pairingsProps";

export default function Pairings(props: pairingsProps) {
  return (
    <div>
      <button>Create pairings (round {props.round})</button>
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
                <button>Report Result</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
