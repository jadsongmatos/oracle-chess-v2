import type { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from 'cookies-next';
import prisma from "@/services/db"
import { verify_hash } from "@/services/auth"
import { createJWT } from "@/services/jwt"

const refresh = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  if (req.method === "POST") {
    try {
      const user = await prisma.user.findFirst({
        where: {
          email: req.body.email,
        },
        select: {
          id: true,
          username: true,
          password: true,
        },
      });

      if (user) {
        if (await verify_hash(
          req.body.email+req.body.password,
          user.password
        )) {
          const jwt = await createJWT({
            id: user.id,
            username: req.body.username,
            email: req.body.email,
          })

          setCookie('jwt', jwt, { req, res });
          res.status(200).end()
        } else {
          return res.status(409).end()
        }
      } else {
        return res.status(409).end()
      }
    } catch (error) {
      console.error("Error verify_hash", error);
      return res.status(409).end()
    }
  } else if (req.method === "OPTIONS") {
    res.setHeader("Allow", ["GET", "OPTIONS"]);
    res.end()
  } else {
    res.setHeader("Allow", ["GET", "OPTIONS"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default refresh;
