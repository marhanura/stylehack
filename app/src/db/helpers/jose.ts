import * as jose from "jose";
import CustomError from "./CustomError";

const secret = new TextEncoder().encode(process.env.SECRET_KEY_JWT);
export async function signToken(payload: { _id: string; email: string }) {
  try {
    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);
    return token;
  } catch (error) {
    throw error;
  }
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify<{
      _id: string;
      email: string;
    }>(token, secret);
    return payload;
  } catch (error) {
    throw error;
  }
}
