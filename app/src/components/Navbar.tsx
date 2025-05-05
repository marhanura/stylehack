import Image from "next/image";
import LogoText from "../../public/logotext.png";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="w-full shadow-sm fixed z-50">
      <div className="navbar bg-[#e7dfd1] border-b-1 border-gray-300 w-full">
        <div className="navbar-start gap-5 px-5 hover:cursor-pointer">
          <Link
            href="/recommendation"
            className="hover:cursor-pointer inline-flex gap-1 items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Create My Style
          </Link>
        </div>
        <div className="navbar-center">
          <Link href="/">
            <Image src={LogoText} width={150} alt="Logo Text" />
          </Link>
        </div>
        <div className="navbar-end gap-3 pr-2">
          <div className="dropdown dropdown-end">
            <Link
              href="/profile"
              className="hover:cursor-pointer inline-flex gap-1 items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              My Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
