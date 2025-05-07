import CustomError from "@/db/helpers/CustomError";
import RecomendationModel from "@/db/models/RecomendationModel";
import { NextRequest, NextResponse } from "next/server";

interface IParams {
  params: Promise<{ _id: string }>;
}

export async function GET(req: NextRequest, params: IParams) {
  try {
    const { _id } = await params.params;
    if (!_id) {
      throw new CustomError("recommendationId is required", 400);
    }

    const userId = req.headers.get("x-user-id");
    if (!userId) {
      throw new CustomError("Unauthorized", 401);
    }

    const recommendation =
      await RecomendationModel.getLoginUserRecommendationById(_id, userId);

    return NextResponse.json(recommendation);
  } catch (err: unknown) {
    if (err instanceof CustomError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
