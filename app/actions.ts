"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as cheerio from "cheerio";
import CustomError from "@/db/helpers/CustomError";

export async function removeToken() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  redirect("/");
}

export interface Metadata {
  title?: string;
  image?: string;
  description?: string;
  price?: string;
}
