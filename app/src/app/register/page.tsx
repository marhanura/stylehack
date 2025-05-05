"use server";
import Image from "next/image";
import Logo from "../../../public/logotext.png";
import RegisterImage from "../../../public/register.webp";
import { redirect } from "next/navigation";
import Link from "next/link";
import { IProps } from "../login/page";
import { cookies } from "next/headers";

export async function handleRegister(formData: FormData): Promise<void> {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const gender = formData.get("gender");
  const ageRange = formData.get("ageRange");

  const res = await fetch(`http://localhost:3000/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      gender,
      ageRange,
    }),
  });
  if (!res.ok) {
    const data = await res.json();
    redirect(`/register?error=${data.message}`);
  }
  redirect("/login");
}

export default async function RegisterPage(props: IProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");
  if (token) {
    redirect("/");
  }
  const { error } = (await props.searchParams) || {};

  return (
    <div className="flex flex-row min-h-screen bg-[#E7DFD1]">
      <form
        className="flex flex-col flex-1 p-15 items-center justify-center"
        action={handleRegister}
      >
        <Image src={Logo} height={30} alt="Logo" className="mb-5" />
        <h1 className="font-(family-name:--font-bodoni-moda) text-[28px]">
          Register
        </h1>
        {error && <div className="text-xs text-red-500 mt-5">{error}</div>}

        <input
          className="input my-3 rounded-sm border-0"
          type="text"
          name="name"
          placeholder="Name"
        />
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
        <select
          className="select my-3 rounded-sm border-0 w-full max-w-xs"
          name="gender"
        >
          <option value="">Select gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
        <select
          className="select my-3 rounded-sm border-0 w-full max-w-xs"
          name="ageRange"
        >
          <option value="">Select age range</option>
          <option value="child">Child</option>
          <option value="teenager">Teenager</option>
          <option value="adult">Adult</option>
        </select>
        <button className="btn btn-secondary my-3 rounded-sm border-0 w-full max-w-xs">
          Register
        </button>
        <p>
          Already have an account? <Link href="/login">Log In</Link>
        </p>
      </form>
      <div className="flex flex-1 justify-center items-center">
        <Image
          src={RegisterImage}
          height={500}
          alt="Register Image"
          className="clip-image"
        />
      </div>
    </div>
  );
}
