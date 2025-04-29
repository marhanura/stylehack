import Navbar from "@/components/Navbar";

import Image from "next/image";
import MainImage from "../../public/main.png";
import Image1 from "../../public/image1.webp";

export default function Home() {
  return (
    <div>
      <div className="h-screen flex flex-col items-center justify-between relative">
        <Navbar />
        <div>
          <div className="text-[64px] font-(family-name:--font-bodoni-moda) uppercase tracking-wide font-bold z-0 absolute self-start left-15">
            <p>Hack</p>
            <p>Your</p>
            <p>Style</p>
          </div>
          <Image
            src={MainImage}
            width={400}
            alt="Main Image"
            className="z-10"
          />
        </div>
      </div>
      <div className="h-screen bg-[#e7dfd1]">
        <Image src={Image1} width={250} alt="Example" />
      </div>
    </div>
  );
}
