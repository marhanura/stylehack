import OrderModel from "@/db/models/OrderModel";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

interface IParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, params: IParams) {
  try {
    const { id } = await params.params;
    const order = await OrderModel.findOne({ _id: new ObjectId(id) });

    return Response.json(order);
  } catch (error) {
    console.log(error);
    return Response.json({ message: "ISE" }, { status: 500 });
  }
}
