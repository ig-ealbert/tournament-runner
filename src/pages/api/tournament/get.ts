import { currentTournament } from "@/lib/tournamentSingleton";
import { tournament } from "@/types/tournament";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<tournament>
) {
  const data = currentTournament.getTournamentData();
  if (!data) {
    throw Error("No tournament data available");
  }
  res.status(200).send(data);
}
