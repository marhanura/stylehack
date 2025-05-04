import CustomError from "@/db/helpers/CustomError";
import RecomendationModel from "@/db/models/RecomendationModel";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

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
