import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/services/db";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "30mb",
    },
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const data_job = Buffer.from(JSON.stringify({
        moves: req.body.moves,
        values: req.body.values,
      }))

      const check_job = await prisma.job.findMany({
        where: {
          data: data_job,
        },
      });

      console.log("check_job", check_job);
      if (check_job) {
        if (check_job.length > 3) {
    
        } 

        const new_job = await prisma.job.create({
          data: {
            data: data_job,
            status: "pending",
            user_id: req.body.user_id
          },
        });
        console.log(new_job)
        res.status(200).json(new_job)
      }

      

      
    } catch (err) {
      console.log("err",err)
      res.status(404).json({ error: err });
    }
  } else if (req.method === "OPTIONS") {
    res.setHeader("Allow", ["GET", "OPTIONS"]);
    res.end();
  } else {
    res.setHeader("Allow", ["GET", "OPTIONS"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
