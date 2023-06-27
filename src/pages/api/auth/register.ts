import type { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "cookies-next";
import prisma from "@/services/db";
import { create_hash } from "@/services/auth";
import { createJWT } from "@/services/jwt";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const password = await create_hash(req.body.email+req.body.password);
      const new_user = await prisma.user.create({
        data: {
          username: req.body.username,
          email: req.body.email,
          birthday: req.body.birthday,
          password: password,
        },
      });
      const jwt = await createJWT({
        id: new_user.id,
        username: req.body.username,
        email: req.body.email,
      });

      setCookie("jwt", jwt, { req, res });
      res.status(200).end();

      await prisma.location.create({
        data: {
          latitude: req.body.latitude,
          longitude: req.body.longitude,
          city: req.body.city,
          state: req.body.state,
          nation: req.body.nation,
          user_id: new_user.id,
        },
      });
    } catch (err: any) {
      if (err.code == "P2002") {
        res.status(409).json({ code: "P2002", ...err.meta });
      } else {
        console.error(err);
        res.status(500).end();
      }
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
