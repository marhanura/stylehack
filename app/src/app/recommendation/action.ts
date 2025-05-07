"use server";

import { cookies } from "next/headers";
import cloudinary from "@/db/helpers/cloudinary";
import { callAiRecommendation, Prompt } from "@/db/helpers/aiHelpers";
import RecommendationModel from "@/db/models/RecomendationModel";
import { verifyToken } from "@/db/helpers/jose";
import { ObjectId } from "mongodb";
import UserModel from "@/db/models/UserModel";

export async function generateRecommendation(formData: FormData) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("access_token")?.value;
  if (!tokenCookie) throw new Error("Unauthorized");
  const payload = await verifyToken(tokenCookie);
  const userId = payload._id;

  const user = await UserModel.findOne({ _id: new ObjectId(userId) });
  if (!user) throw new Error("User not found");
  if (user.quota <= 0)
    throw new Error("Token run out. Please top up to continue.");

  // 2) build prompt
  const type = formData.get("type") as Prompt["type"];
  const inputField = formData.get("input") as string | null;
  // console.log(type, "<<tipe", inputField, "<<input")
  if (type !== "image") {
    if (!type || !inputField) throw new Error("Missing prompt");
  }

  let imageUrl = "";

  // 3) if image, upload to Cloudinary
  if (type === "image") {
    const file = formData.get("file") as File | null;
    if (!file) throw new Error("No file uploaded");
    const buffer = Buffer.from(await file.arrayBuffer());
    const upload = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (err, res) => {
            if (err) reject(err);
            else resolve(res as { secure_url: string });
          }
        );
        stream.end(buffer);
      }
    );
    imageUrl = upload.secure_url;
  }

  // 4) call AI via our Next API
  let prompt: Prompt;
  if (type === "image") {
    prompt = {
      type,
      input: imageUrl,
    };
  } else {
    prompt = {
      type,
      input: `${user.gender}, ${user.ageRange}, ${inputField}`,
    };
  }
  const products = await callAiRecommendation(prompt);

  // 5) save to Mongo
  const insertedId = await RecommendationModel.create({
    userId: new ObjectId(userId),
    prompt: {
      type,
      input: type === "image" ? imageUrl : (inputField as string),
    },
    products,
    isWishlisted: false,
  });

  await UserModel.decreaseQuota(new ObjectId(userId));

  return { insertedId: insertedId.toString(), products };
}
