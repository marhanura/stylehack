import User from "@/db/models/User";
import { MongoloquentNotFoundException } from "mongoloquent";

interface IParams {
  params: Promise<{ _id: string }>;
}

export async function GET(request: Request, params: IParams) {
  try {
    const { _id } = await params.params;

    const data = await User.findOrFail(_id);

    return Response.json(data.getOriginal());
  } catch (error) {
    if (error instanceof MongoloquentNotFoundException) {
      return Response.json(
        { message: error.message },
        { status: error.status ? error.status : 404 }
      );
    }

    return Response.json({ message: "ise" }, { status: 500 });
  }
}

export async function DELETE(request: Request, params: IParams) {
  try {
    const { _id } = await params.params;
    const data = await User.findOrFail(_id);
    await data.delete();
    return Response.json({ message: `Success delete user with id ${_id} `});
  } catch (error) {
    if (error instanceof MongoloquentNotFoundException) {
      return Response.json(
        { message: error.message },
        { status: error.status ? error.status : 404 }
      );
    }
    return Response.json({ message: "ise" }, { status: 500 });
  }
}
