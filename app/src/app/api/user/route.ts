import CustomError from "@/db/helpers/CustomError";
import UserModel, { IUser } from "@/db/models/UserModel";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // const body: {_id: string} = await request.json()
    // console.log(body)
    const data = await UserModel.findOne({
      _id: new ObjectId("680f9202609d28de2614f266"),
    });
    if (!data) {
      throw new CustomError("User not found", 404);
    }

    return Response.json(data);
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
