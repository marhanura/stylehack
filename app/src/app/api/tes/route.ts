import { NextRequest } from "next/server";



export async function GET(request:NextRequest) {
    try {
        const ip = request.headers.get("x-forwarded-for")
        const userAgent = request.headers.get("user-agent")

        return Response.json({ip, userAgent})
    } catch (error) {
        console.log(error)
        return Response.json({message: "ISE"}, {status:500})
    }
}