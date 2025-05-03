import CustomError from "@/db/helpers/CustomError";
import UserModel from "@/db/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

interface IUser {
  name: string;
  email: string;
  password: string;
  gender: string;
  ageRange: string;
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
  ageRange: z
    .string()
    .min(1, { message: "Age range is required" })
    .refine((val) => val === "child" || val === "teenager" || val === "adult", {
      message: "Age range must be either child, teenager or adult",
    }),
});

export async function POST(req: NextRequest) {
  try {
    const payload: IUser = await req.json();
    newUserSchema.parse(payload);
    const { name, email, password, gender, ageRange } = payload;

    const message = await UserModel.register({
      name,
      email,
      password,
      gender,
      quota: 10,
      ageRange,
    });

    return NextResponse.json({ message });
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
