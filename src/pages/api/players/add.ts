import { currentTournament } from "@/lib/tournamentSingleton";
import { participant } from "@/types/participant";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<participant | string>
) {
  const name = req.body.playerName;
  if (!name) {
    res.status(400).send("playerName required in post body");
  }
  const addedPlayer = currentTournament.addPlayer(name);
  res.status(200).send(addedPlayer);
}
