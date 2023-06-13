import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../services/db"

export type Root = Root2[]

export interface Root2 {
  move: number
  id: number
}

type ResErro = {
  error: any;
};

async function getMoves(id: number) {
  try {
    let move = await prisma.tree.findUnique({
      where: { id: id },
      select: {
        previousMoveId: true,
        move: true,
        id: true
      }
    })

    let moves: any = []
    while (move?.previousMoveId != null) {
      moves.push({ move: move.move, id: move.id, })
      move = await prisma.tree.findUnique({
        where: { id: move.previousMoveId },
        select: { previousMoveId: true, move: true, id: true }
      })
    }

    return moves
  } catch (error) {
    console.log("error getMoves get tree", error)
    return error
  }
}

async function get() {
  try {
    let result_id: any = await prisma.$queryRaw`
    WITH cte AS (
      SELECT t1.id, t1.move
      FROM "Tree" as t1
      LEFT JOIN "Tree" as t2 ON t1.id = t2."previousMoveId"
      WHERE t2."previousMoveId" IS NULL
      ORDER BY t1."updateTime" 
      LIMIT 1
      OFFSET ${Math.floor(Math.random() * 256)}
    )
    UPDATE "Tree" 
    SET "updateTime" = CURRENT_TIMESTAMP
    WHERE id IN (SELECT id FROM cte)
    RETURNING move, id;
    `
    console.log("result", result_id)
    let moves = [result_id[0]]
    moves.push(...await getMoves(result_id[0].id))
    return moves
  } catch (error:any) {
    console.log("error queryRaw get tree", error)
    return error
  }

}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Root | ResErro>
) {
  if (req.method === "GET") {

    try {
      const result = await get()
      res.status(200).json(result)
    } catch (err) {
      res.status(404).json({ error: err });
    }

  } else if (req.method === "OPTIONS") {
    res.setHeader("Allow", ["GET", "OPTIONS"]);
    res.end()
  } else {
    res.setHeader("Allow", ["GET", "OPTIONS"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
