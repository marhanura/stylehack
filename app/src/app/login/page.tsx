import Image from "next/image";
import Logo from "../../../public/logotext.png";
import LoginImage from "../../../public/login.webp";
export default function LoginPage() {
  return (
    <div className="flex flex-row h-screen bg-[#E7DFD1]">
      <form className="flex flex-col flex-1 p-15 items-center justify-center">
        <Image src={Logo} height={30} alt="Logo" className="mb-5" />
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
