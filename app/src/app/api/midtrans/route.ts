import CustomError from "@/db/helpers/CustomError";
import OrderModel from "@/db/models/OrderModel";
import UserModel from "@/db/models/UserModel";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import { createHash } from "node:crypto";

interface IBody {
  transaction_status: string;
  signature_key: string;
  order_id: string;
  gross_amount: string;
  status_code: string;
}

export async function POST(request: NextRequest) {
  const body: IBody = await request.json();
  // console.log(body, "<<<<<<<<body");
  try {
    if (
      body.transaction_status !== "settlement" &&
      body.transaction_status !== "capture" && 
      body.transaction_status !== "pending" &&
      body.transaction_status !== "expire"
    ) {
      throw new CustomError("Status not right", 400);
    }

    
    if (!body.order_id) {
        throw new CustomError("orderId required", 400);
    }
    
    const order = await OrderModel.findOne({
        _id: new ObjectId(body.order_id.split("-")[1]),
    });

    
    if (!order) {
        throw new CustomError("order not found", 404);
    }
    
    if(body.transaction_status === "pending"){
        await OrderModel.updateStatusPending(order._id)
        return Response.json({message: 'oke bang'}, {status: 200})
    }

    if(body.transaction_status === "expire"){
      await OrderModel.updateStatusExpire(order._id)
      return Response.json({message: 'oke bang'}, {status: 200})
  }
    
    if (!body.gross_amount) {
      throw new CustomError("Gross amount required", 400);
    }

    if (body.gross_amount.split(".")[0] !== order.amount.toString()) {
      throw new CustomError("Amount not match", 400);
    }

    if (!body.signature_key) {
      throw new CustomError("sk required", 400);
    }

    if (!body.status_code) {
      throw new CustomError("status code required", 400);
    }

    const key = createHash("sha512")
      .update(
        body.order_id +
          body.status_code +
          body.gross_amount +
          process.env.MIDTRANS_SERVER
      )
      .digest("hex");

    if (key !== body.signature_key) {
      throw new CustomError("sk not match", 401);
    }

    const userCollection = UserModel.getCollection()

    const user = await userCollection.findOne({_id: order.userId})

    if(!user){
        throw new CustomError("user not found", 404)
    }

    if(!user.quota){
        throw new CustomError("quota user not found")
    }

    await UserModel.addQuota(order.userId, user.quota + 10)

    await OrderModel.updateStatusPaid(order._id)

    return Response.json({ message: "success", order }, { status: 200 });
  } catch (error) {
    // console.log(error);
    if (error instanceof CustomError) {
      return Response.json(
        { message: error.message },
        { status: error.status }
      );
    }
    return Response.json({ message: "ise" }, { status: 500 });
  }
}
