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

export async function DELETE(request: NextRequest){
  try {
    const _id = request.headers.get("x-user-id")
    if(!_id){
      throw new CustomError("Unauthorized", 401)
    }
    const user = await UserModel.findOne({_id: new ObjectId(_id)})
    if(!user){
      throw new CustomError("User not found", 404)
    }
    await UserModel.delete(new ObjectId(_id))
    return Response.json({message: "Success delete user"})
  } catch (error) {
    if (error instanceof CustomError) {
      return Response.json(
        { message: error.message },
        { status: error.status }
      );
    }
    return Response.json({message: "ISE"}, {status: 500})
  }
}
