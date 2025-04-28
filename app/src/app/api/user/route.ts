import User from "@/db/models/User";


export async function GET() {
  try {
    const users = await User.all();

    return Response.json(users);
  } catch (error) {
    return Response.json(error, { status: 500 });
  }
}
