import CustomError from "@/db/helpers/CustomError";
import RecomendationModel from "@/db/models/RecomendationModel";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
export const dynamic = "force-dynamic";

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

export async function POST(request: Request) {
  try {
    const { input } = await request.json();
    const FASTAPI = process.env.NEXT_PUBLIC_BACKEND_URL!;
    const res = await fetch(`${FASTAPI}/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });
    const data = await res.json();
    // const data = { message: "jalan" };
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.log(err);
    if (err instanceof CustomError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status }
      );
    }
    return NextResponse.json(
      { message: err.message || "Internal Error" },
      { status: 500 }
    );
  }
}
