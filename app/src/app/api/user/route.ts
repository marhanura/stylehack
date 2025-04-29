import UserModel from "@/db/models/UserModel";
import { NextRequest } from "next/server";




export async function GET(request: NextRequest) {
  try {

    // const users = await UserModel

   

    return Response.json({message:"jalan"});
  } catch (error) {
    console.log(error)
    return Response.json(error, { status: 500 });
  }
}
