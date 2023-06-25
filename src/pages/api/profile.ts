import type { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from 'cookies-next';
import prisma from "@/services/db"
import { createJWT } from "@/services/auth"
import bcrypt from "bcrypt";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const password = await bcrypt.hash(req.body.password, 1808);
      const new_user = await prisma.user.create({
        data: {
          username: req.body.username,
          email: req.body.email,
          birthday: req.body.birthday,
          password: password
        }
      })
      const jwt = await createJWT({
        id: new_user.id,
        username: req.body.username,
        email: req.body.email,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        city: req.body.city,
        state: req.body.state,
        nation: req.body.nation,
      })

      setCookie('jwt', jwt, { req, res });
      res.status(200).end()

      await prisma.location.create({
        data: {
          latitude: req.body.latitude,
          longitude: req.body.longitude,
          city: req.body.city,
          state: req.body.state,
          nation: req.body.nation,
          user_id: new_user.id
        }
      })
    } catch (err: any) {
      if (err.code == "P2002") {
        res.status(409).json({ code: "P2002", ...err.meta })
      } else {
        console.error(err)
        res.status(500).end()
      }
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