const SECRET_KEY = process.env.SECRET_KEY ? process.env.SECRET_KEY : ""
const JWT_SECRET_KEY = new TextEncoder().encode(process.env.SECRET_KEY ? process.env.SECRET_KEY : "")

import { jwtVerify, SignJWT } from "jose";
import bcrypt from "bcrypt";

export const verify_hash = (plainPassword: string, hashedPassword: string) => {
  return bcrypt.compareSync(SECRET_KEY + plainPassword, hashedPassword)
};

export const create_hash = (plainPassword: string) => {
  return bcrypt.hashSync(plainPassword, SECRET_KEY)
};

export async function verify_auth(token: string) {
  if (!token) {
    throw new Error("Missing user token");
  }

  try {
    const verified = await jwtVerify(
      token,
      JWT_SECRET_KEY
    );
    return verified.payload;
  } catch (err) {
    console.log("AuthError----", err);
    throw new Error("Your token has expired");
  }
}

export async function createJWT(payload: any) {
  const signedToken = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" }) // Set the protected header with the HS256 algorithm
    .setIssuedAt() // Set the issued timestamp to the current time
    .setExpirationTime('2h')
    .sign(JWT_SECRET_KEY)

  return signedToken;
}
