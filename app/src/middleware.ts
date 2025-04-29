import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import CustomError from "./db/helpers/CustomError";
import { JWSInvalid, JWSSignatureVerificationFailed } from "jose/errors";
import { verifyToken } from "./db/helpers/jose";

export async function middleware(request: NextRequest) {
  try {
    if (request.nextUrl.pathname.startsWith("/api")) {
      if (
        !request.nextUrl.pathname.startsWith("/api/login") &&
        !request.nextUrl.pathname.startsWith("/api/register")
      ) {
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token");
        if (!token) throw new CustomError("Unauthorized", 401);

        const payload = await verifyToken(token.value);

        if (!payload._id || !payload.email)
          throw new CustomError("Unauthorized", 401);

        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user-id", payload._id);
        requestHeaders.set("x-user-email", payload.email);
        const response = NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
        return response;
      }
    }
  } catch (err: unknown) {
    if (err instanceof CustomError)
      return NextResponse.json(
        { message: err.message },
        { status: err.status }
      );
    else if (
      err instanceof JWSInvalid ||
      err instanceof JWSSignatureVerificationFailed
    ) {
      return NextResponse.json({ message: err.message }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
