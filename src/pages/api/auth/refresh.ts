import type { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from 'cookies-next';
import prisma from "@/services/db"
import { verifyAuth } from "@/services/auth"
import bcrypt from "bcrypt";

const refresh = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  if (req.method === "POST") {
    let id_user
    try {
      // Get the user's JWT from the request
      const token = await verifyAuth(String(req.cookies['next-auth.session-token']));
      console.log("token",token)
      /*if (token == false) {
        return res.status(403).json({ error: "erro verify token" });
      } else {
        id_user = Number(token.id_user)
      }*/
      id_user = Number(token.id_user)
    } catch (error) {
      console.error("Error verifyAuth", error);
      return res.status(500).end()
    }

    //const new_token = createJWT() TODO: Pegar dados novos do usuario
    res.end()
    //res.json(insert);
  } else if (req.method === "OPTIONS") {
    res.setHeader("Allow", ["GET", "OPTIONS"]);
    res.end()
  } else {
    res.setHeader("Allow", ["GET", "OPTIONS"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default refresh;
