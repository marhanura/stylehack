import CustomError from "@/db/helpers/CustomError";
import UserModel, { ILogin } from "@/db/models/UserModel";
import { JWSInvalid } from "jose/errors";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid email format"),
  password: z.string().min(1, { message: "Password is required" }),
});

export async function POST(request: NextRequest) {
  try {
    const body: ILogin = await request.json();
    loginSchema.parse(body);

    const token = await UserModel.login(body);

    return NextResponse.json({ token });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      const error = err.errors[0];
      return NextResponse.json(
        { message: `${error.path} - ${error.message}` },
        { status: 400 }
      );
    } else if (err instanceof JWSInvalid) {
      return NextResponse.json({ message: err.message }, { status: 401 });
    } else if (err instanceof CustomError) {
      return NextResponse.json(
        { message: `${err.message}` },
        { status: err.status }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
