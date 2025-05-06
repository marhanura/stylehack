"use client";
import Image from "next/image";
import Logo from "../../../public/logotext.png";
import RegisterImage from "../../../public/register.webp";
import Link from "next/link";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "../../../actions";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await getToken();
        if (token) {
          router.push("/");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    }

    checkAuth();
  }, [router]);

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const gender = formData.get("gender");
    const ageRange = formData.get("ageRange");

    try {
      const res = await fetch(`/api/register`, {
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
        Swal.fire({
          text: data.message,
          icon: "error",
        });
        setIsLoading(false);
        return;
      }
      Swal.fire({
        text: "Registration successful",
        icon: "success",
        timer: 1500,
      });
      router.push("/login");
    } catch (error) {
      Swal.fire({
        text: error as string,
        icon: "error",
      });
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-row min-h-screen bg-[#E7DFD1] pt-15">
      <form
        className="flex flex-col flex-1 px-15 items-center justify-center"
        onSubmit={handleRegister}
      >
        <Image src={Logo} height={30} alt="Logo" className="mb-5" />
        <h1 className="font-(family-name:--font-bodoni-moda) text-[28px]">
          Register
        </h1>
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
        <button
          className="btn btn-secondary my-3 rounded-sm border-0 w-full max-w-xs"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Register"}
        </button>
        <p className="mt-5 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-accent">
            Log In
          </Link>
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
