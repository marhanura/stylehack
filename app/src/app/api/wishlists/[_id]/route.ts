import CustomError from "@/db/helpers/CustomError";
import WishlistModel from "@/db/models/WishlistModel";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

interface IParams {
  params: Promise<{ _id: string }>;
}

export async function DELETE(req: NextRequest, params: IParams) {
  try {
    const { _id } = await params.params;
    if (!_id) {
      throw new CustomError("wishlistId is required", 400);
    }

    const userId = req.headers.get("x-user-id");
    if (!userId) {
      throw new CustomError("Unauthorized", 401);
    }

    const wishlist = await WishlistModel.findOne(new ObjectId(_id));
    if (!wishlist) {
      throw new CustomError("Wishlist not found", 404);
    }

    if (wishlist.userId.toString() !== userId) {
      throw new CustomError("Not allowed to delete wishlist", 403);
    }

    await WishlistModel.deleteWishlist(new ObjectId(_id));

    return NextResponse.json({
      message: `Success delete wishlist with id ${wishlist._id.toString()} `,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return Response.json(
        { message: error.message },
        { status: error.status }
      );
    }
    return Response.json({ message: "ISE" }, { status: 500 });
  }
}
