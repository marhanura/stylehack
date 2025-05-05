// src/app/recommendation/action.ts
"use server";

import { cookies } from "next/headers";
import cloudinary from "@/db/helpers/cloudinary";
import { callAiRecommendation, Prompt } from "@/db/helpers/aiHelpers";
import RecommendationModel from "@/db/models/RecomendationModel";
import { verifyToken } from "@/db/helpers/jose";
import { ObjectId } from "mongodb";

export async function generateRecommendation(formData: FormData) {
  // 1) authenticate
  const cookieStore = await cookies(); // await the cookie store
  const tokenCookie = cookieStore.get("access_token")?.value;
  if (!tokenCookie) throw new Error("Unauthorized");
  const payload = await verifyToken(tokenCookie);
  const userId = payload._id;

  // 2) build prompt
  const type = formData.get("type") as Prompt["type"];
  const inputField = formData.get("input") as string | null;
  if (!type || !inputField) throw new Error("Missing prompt");
  let input = inputField;

  // 3) if image, upload to Cloudinary
  if (type === "image") {
    const file = formData.get("file") as File | null;
    if (!file) throw new Error("No file uploaded");
    const buffer = Buffer.from(await file.arrayBuffer());
    const upload = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
      stream.end(buffer);
    });
    input = upload.secure_url;
  }

  // 4) call AI via our Next API
  const prompt: Prompt = { type, input };
  const products = await callAiRecommendation(prompt);

  // 5) save to Mongo
  await RecommendationModel.create({
    userId: new ObjectId(userId),
    prompt,
    products,
  });

  return products;
}
