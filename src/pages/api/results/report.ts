import { currentTournament } from "@/lib/tournamentSingleton";
import { result } from "@/types/result";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<result | string>
) {
  const player1Id = req.body.player1;
  const player2Id = req.body.player2;
  const outcome = req.body.outcome as result;
  if (!player1Id || !player2Id || !outcome) {
    res.status(400).send("both players' ids and the outcome are required");
  }
  const reportOutput = currentTournament.reportResult(
    player1Id,
    player2Id,
    outcome
  );
  res.status(200).send(reportOutput);
}
