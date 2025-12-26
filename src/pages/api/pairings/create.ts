import { currentTournament } from "@/lib/tournamentSingleton";
import { participant } from "@/types/participant";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<participant[][]>
) {
  const pairings = currentTournament.makePairings();
  if (!pairings) {
    res.status(500).send([]);
  }
  res.status(200).send(pairings || []);
}
