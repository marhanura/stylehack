import CustomError from "@/db/helpers/CustomError";
import RecomendationModel from "@/db/models/RecomendationModel";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
export const dynamic = "force-dynamic";
import { verifyToken } from "@/db/helpers/jose";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      throw new CustomError("Unauthorized", 401);
    }

    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get("page");

    const recommendations =
      await RecomendationModel.getLoginUserRecommendations(userId, page);

    return NextResponse.json(recommendations);
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

    return Response.json({ message: "ISE" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { input, type } = await request.json();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/recommend`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      }
    );
    if (!res.ok) throw new Error("AI service failed");
    const { products } = await res.json();

    await RecomendationModel.create({
      userId: new ObjectId(userId),
      prompt: { type, input },
      products,
    });

    return NextResponse.json({ products });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
