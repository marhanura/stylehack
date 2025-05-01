import CustomError from "@/db/helpers/CustomError";
import WishlistModel from "@/db/models/WishlistModel";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const _id = req.headers.get("x-user-id");
    if (!_id) {
      throw new CustomError("Unauthorized", 401);
    }

    const { recommendationId }: { recommendationId: string } = await req.json();
    if (!recommendationId) {
      throw new CustomError("recommendationId is required", 400);
    }

    const message = await WishlistModel.createWishlist({
      userId: new ObjectId(_id),
      recomendationId: new ObjectId(recommendationId),
    });

    return NextResponse.json({ message }, { status: 201 });
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
