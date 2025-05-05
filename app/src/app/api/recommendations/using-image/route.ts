import cloudinary from "@/db/helpers/cloudinary";
import { NextResponse } from "next/server";

interface UploadResult {
  secure_url: string;
  public_id: string;
  [key: string]: any;
}

export const dynamic = "force-dynamic";

function streamUpload(buffer: Buffer): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result as UploadResult);
      }
    );
    stream.end(buffer);
  });
}

export async function POST(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "File missing or invalid" },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "File is empty" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result: UploadResult = await streamUpload(buffer);

    return NextResponse.json({
      message: "Upload successful",
      url: result.secure_url,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
