"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function setToken(access_token: string) {
  const cookieStore = await cookies();
  cookieStore.set("access_token", access_token);
}

export async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  return token;
}

export async function removeToken() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  redirect("/");
}
