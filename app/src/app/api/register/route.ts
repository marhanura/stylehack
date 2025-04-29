import { hashPassword } from "@/db/helpers/bcrypt";
import CustomError from "@/db/helpers/CustomError";
import User from "@/db/models/User";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

interface IUser {
  name: string;
  email: string;
  password: string;
  gender: string;
}

const newUserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Email format is wrong"),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters" }),
  gender: z
    .string()
    .min(1, { message: "Gender is required" })
    .refine((val) => val === "male" || val === "female", {
      message: "Gender must be either male or female",
    }),
});

export async function POST(req: NextRequest) {
  try {
    const payload: IUser = await req.json();
    newUserSchema.parse(payload);
    const { name, email, password, gender } = payload;

    const user = await User.where("email", email).first();
    if (user) {
      throw new CustomError("Email must be unique", 400);
    }

    await User.create({
      name,
      email,
      password: hashPassword(password),
      gender,
      quota: 10,
      isPremium: false,
    });

    return NextResponse.json({ message: "Successfully registered user" });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      const error = err.errors[0];
      return NextResponse.json(
        { message: `${error.path} - ${error.message}` },
        { status: 400 }
      );
    } else if (err instanceof CustomError) {
      return NextResponse.json(
        { message: `${err.message}` },
        { status: err.status }
      );
    }

    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
