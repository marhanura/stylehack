import CustomError from "@/db/helpers/CustomError";
import RecomendationModel from "@/db/models/RecomendationModel";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
export const dynamic = "force-dynamic";
import { verifyToken } from "@/db/helpers/jose";
import { ObjectId } from "mongodb";
import { callAiRecommendation } from "@/db/helpers/aiHelpers";

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      throw new CustomError("Unauthorized", 401);
    }

    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get("page");

    const recommendations =
      await RecomendationModel.getLoginUserRecommendations(userId, page);

    return NextResponse.json(recommendations);
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      const error = err.errors[0];
      return NextResponse.json(
        { message: `${error.path} - ${error.message}` },
        { status: 400 }
      );
    } else if (err instanceof CustomError) {
      return NextResponse.json(
        { message: `${err.message}` },
        { status: err.status }
      );
    }

    return Response.json({ message: "ISE" }, { status: 500 });
  }
}

// export async function POST(request: NextRequest) {
//   try {
//     const token = request.cookies.get("access_token")?.value;
//     if (!token) throw new CustomError("Unauthorized", 401);
//     const payload = await verifyToken(token);
//     const userId = payload._id;

//     const { type, input } = await request.json();
//     if (!type || !input) throw new CustomError("Missing prompt", 400);

//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BACKEND_URL}/recommend`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ input }),
//       }
//     );
//     if (!res.ok) throw new Error("AI service failed");
//     const { products } = await res.json();


//    await RecomendationModel.create({
//     userId: new ObjectId(userId),
//     prompt: { type, input },
//      products,
//      isWishlisted: false,
//    });

//     return NextResponse.json({ products });
//   } catch (err: any) {
//     const status = err.status || 500;
//     const msg = err.message || "Internal Server Error";
//     return NextResponse.json({ message: msg }, { status });
//   }
// }
