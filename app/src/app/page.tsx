import Navbar from "@/components/Navbar";

import Image from "next/image";
import MainImage from "../../public/main.png";
import Image2 from "../../public/image2.webp";
import Image3 from "../../public/image3.webp";
import Image4 from "../../public/image4.webp";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="h-screen flex flex-col items-center justify-between relative">
        <Navbar />
        <div>
          <div className="ml-10 text-[72px] font-(family-name:--font-bodoni-moda) uppercase tracking-wide font-bold z-0 absolute top-1/2 left-5 transform -translate-y-1/2 z-0">
            <p>HACK</p>
            <p>YOUR</p>
            <p>STYLE</p>
          </div>
          <Image
            src={MainImage}
            width={450}
            alt="Main Image"
            className="z-10"
          />
        </div>
      </div>
      <div className="h-full bg-[#e7dfd1] shadow-xl p-10 mx-10">
        <h1 className="text-center my-10 font-(family-name:--font-bodoni-moda) text-[28px]">
          Create your best style
        </h1>
        <div className="flex flex-row items-center justify-around">
          <div className="flex flex-col items-center">
            <h1 className="text-center my-3 text-sm">
              Based on inspired look:
            </h1>
            <input
              type="search"
              placeholder="Barbie look"
              className="rounded-none border-b-1 border-stone-600 w-full my-5"
            />
            <Image
              src={Image2}
              width={250}
              alt="Example"
              className="clip-image"
            />
            <Link
              href="/recommendation/image"
              className="p-3 mt-5 bg-primary text-primary-content w-30 text-sm text-center button-slide"
            >
              Try It!
            </Link>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-center my-3 text-sm">Based on destination:</h1>
            <input
              type="search"
              placeholder="I'm going to an art exhibition"
              className="rounded-none border-b-1 border-stone-600 w-full my-5"
            />
            <Image
              src={Image4}
              width={250}
              alt="Example"
              className="clip-image"
            />
            <Link
              href="/recommendation/destination"
              className="p-3 mt-5 bg-primary text-primary-content w-30 text-sm text-center button-slide"
            >
              Try It!
            </Link>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-center my-3 text-sm">
              Create your own freely:
            </h1>
            <input
              type="search"
              placeholder="I'm going picnic!"
              className="rounded-none border-b-1 border-stone-600 w-full my-5"
            />
            <Image
              src={Image3}
              width={250}
              alt="Example"
              className="clip-image"
            />
            <Link
              href="/recommendation/free"
              className="p-3 mt-5 bg-primary text-primary-content w-30 text-sm text-center button-slide"
            >
              Try It!
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
