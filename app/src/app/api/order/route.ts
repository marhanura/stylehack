import CustomError from "@/db/helpers/CustomError";
import OrderModel from "@/db/models/OrderModel";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import midtrans from "midtrans-client";
// import { isProduction } from "midtrans-client/lib/snapBi/snapBiConfig";

export async function POST(request: NextRequest) {
  try {
    const _id = request.headers.get("x-user-id");
    if (!_id) {
      throw new CustomError("Unauthorized", 401);
    }
    const userId = new ObjectId(_id);
    const result = await OrderModel.createOrder(userId);
    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    let parameter = {
      transaction_details: {
        order_id: "STYLE-" + new Date().getTime(),
        gross_amount: totalPrice,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        email: req.user.email,
      },
    };

    const midtransToken = await snap.createTransaction(parameter);

    return Response.json({ message: result });
  } catch (error) {
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
