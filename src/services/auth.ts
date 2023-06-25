const JWT_SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY ? process.env.JWT_SECRET_KEY : "")

import { jwtVerify, SignJWT } from "jose";

export class AuthError extends Error { }

interface UserJwtPayload {
  jti: string;
  iat: number;
}

export async function verifyAuth(token: string) {
  if (!token) {
    throw new AuthError("Missing user token");
  }

  try {
    const verified = await jwtVerify(
      token,
      JWT_SECRET_KEY
    );
    return verified.payload as UserJwtPayload;
  } catch (err) {
    console.log("AuthError----", err);
    throw new AuthError("Your token has expired.");
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
