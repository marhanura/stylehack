import Image from "next/image";
import Logo from "../../../public/logotext.png";
import RegisterImage from "../../../public/register.webp";
export default function RegisterPage() {
  return (
    <div className="flex flex-row h-screen bg-[#E7DFD1]">
      <form className="flex flex-col flex-1 p-15 items-center justify-center">
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
        <select className="select my-3 rounded-sm border-0 w-full max-w-xs">
          <option value="">Select gender</option>
          <option>Female</option>
          <option>Male</option>
        </select>
        <button className="btn btn-secondary my-3 rounded-sm border-0 w-full max-w-xs">
          Register
        </button>
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
