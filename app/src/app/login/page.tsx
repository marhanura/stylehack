"use server";
import Image from "next/image";
import Logo from "../../../public/logotext.png";
import LoginImage from "../../../public/login.webp";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";

export async function handleLogin(formData: FormData): Promise<void> {
  const email = formData.get("email");
  const password = formData.get("password");
  console.log("🐄 - handleLogin - input:", email, password);

  const res = await fetch(`http://localhost:3000/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
  if (!res.ok) {
    const data = await res.json();
    redirect(`/login?error=${data.message}`);
  }
  const data = await res.json();
  const cookieStore = await cookies();
  cookieStore.set("access_token", data.message);
  redirect("/");
}

export default async function LoginPage() {
  return (
    <div className="flex flex-row h-screen bg-[#E7DFD1]">
      <form
        className="flex flex-col flex-1 p-15 items-center justify-center"
        action={handleLogin}
      >
        <Image src={Logo} height={30} alt="Logo" className="mb-5" priority />
        <h1 className="font-(family-name:--font-bodoni-moda) text-[28px]">
          Log In
        </h1>
        <input
          className="input my-3 rounded-sm border-0"
          type="text"
          name="email"
          placeholder="Email"
        />
        <input
          className="input my-3 rounded-sm border-0"
          type="password"
          name="password"
          placeholder="Password"
        />
        <button className="btn btn-secondary my-3 rounded-sm border-0 w-full max-w-xs">
          Log In
        </button>
        <p>
          Don`t have an account? <Link href="/register">Register</Link>
        </p>
      </form>
      <div className="flex flex-1 justify-center items-center">
        <Image
          src={LoginImage}
          height={500}
          alt="Login Image"
          className="clip-image"
        />
      </div>
    </div>
  );
}
