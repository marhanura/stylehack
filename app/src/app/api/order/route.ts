import CustomError from "@/db/helpers/CustomError";
import OrderModel from "@/db/models/OrderModel";
import UserModel from "@/db/models/UserModel";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const _id = request.headers.get("x-user-id");
    if (!_id) {
      throw new CustomError("Unauthorized", 401);
    }
    const userId = new ObjectId(_id);
    const { insertedId } = await OrderModel.createOrder(userId);
    const user = await UserModel.findOne({_id: userId})
    if(!user || !user._id || !user.email){
      throw new CustomError("User not found", 404)
    }

    // let snap = new midtransClient.Snap({
    //   isProduction: false,
    //   serverKey,
    //   clientKey
    // });

    // let parameter = {
    //   transaction_details: {
    //     order_id: result.insertedId,
    //     gross_amount: 99000,
    //   },
    //   credit_card: {
    //     secure: true,
    //   },

    // };

    // const midtransToken = await snap.createTransaction(parameter);
    const data = await OrderModel.createMidtransTransaction(insertedId.toString(), user.name, user.email);

    if(!data.redirect_url){
      throw new CustomError("Midtrans error", 500)
    }
    await OrderModel.setLink(data.redirect_url, insertedId)

    return Response.json({orderId: insertedId});
  } catch (error: unknown) {
    console.log("🐄 - POST - error:", error);
    if (error instanceof CustomError) {
      return Response.json(
        { message: error.message },
        { status: error.status }
      );
    }
    return Response.json({ message: "ISE" }, { status: 500 });
  }
}
