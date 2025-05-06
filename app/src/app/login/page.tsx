"use client";
import Image from "next/image";
import Logo from "../../../public/logotext.png";
import LoginImage from "../../../public/login.webp";
import Link from "next/link";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, setToken } from "../../../actions";
import Swal from "sweetalert2";

export default function LoginPage() {
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

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch(`/api/login`, {
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
        Swal.fire({
          text: data.message,
          icon: "error",
        });
        setIsLoading(false);
        return;
      }
      const data = await res.json();
      setToken(data.token);
      Swal.fire({
        text: "Login successful",
        icon: "success",
        timer: 1500,
      });
      router.push("/");
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
        className="flex flex-col flex-1 p-15 items-center justify-center"
        onSubmit={handleLogin}
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
        <button
          className="btn btn-secondary my-3 rounded-sm border-0 w-full max-w-xs"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Log In"}
        </button>
        <p className="mt-5 text-sm">
          Don`t have an account?{" "}
          <Link href="/register" className="font-bold text-accent">
            Register
          </Link>
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
