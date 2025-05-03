import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

interface IProps {
  children: React.ReactNode;
}

export default async function AuthLayout(props: IProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");
  if (!token?.value) {
    redirect("/login");
  }

  return <>{props.children}</>;
}
