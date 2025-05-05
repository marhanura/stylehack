import Image from "next/image";
import MainImage from "../../public/main.png";
import Image2 from "../../public/image2.webp";
import Image3 from "../../public/image3.webp";
import Image4 from "../../public/image4.webp";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="h-screen flex flex-col items-end justify-end relative">
        <div className="w-full relative flex flex-row items-center justify-end bottom-0">
          <div className="ml-10 text-[72px] font-(family-name:--font-bodoni-moda) uppercase tracking-wider font-bold z-0">
            <p className="opacity-90 hover:opacity-100 transition-all duration-300">
              HACK
            </p>
            <p className="opacity-90 hover:opacity-100 transition-all duration-300 ml-10">
              YOUR
            </p>
            <p className="opacity-90 hover:opacity-100 transition-all duration-300 ml-20">
              STYLE
            </p>
          </div>
          {/* <div className="z-10"> */}
          <Image
            src={MainImage}
            width={500}
            alt="Main Image"
            className="mx-auto z-10"
          />
          {/* <div className="mt-5 max-w-md"> */}
          <p className="w-80 mb-10 italic text-lg border-l-2 border-primary p-5 bottom-0 self-end">
            Fashion made easy, personalized, and effortless.
          </p>
          {/* </div> */}
          {/* </div> */}
        </div>
      </div>
      <div className="h-full bg-[#e7dfd1] shadow-xl p-10 mx-10">
        <h1 className="text-center my-10 font-(family-name:--font-bodoni-moda) text-[36px]">
          Create your best style
        </h1>
        <div className="flex flex-row items-center justify-around">
          <div className="flex flex-col items-center">
            <h1 className="text-center my-3 text-sm">Based on inspired look</h1>
            <span className="border-b-1 border-stone-600 my-5 w-full">
              <input
                type="search"
                placeholder="Barbie look"
                className="rounded-none my-1 typewriter"
              />
            </span>
            <Image
              src={Image2}
              width={250}
              alt="Example"
              className="clip-image"
            />
            <Link
              href="/recommendation"
              className="p-3 mt-5 bg-primary text-primary-content w-30 text-sm text-center button-slide"
            >
              Try It!
            </Link>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-center my-3 text-sm">Based on destination</h1>
            <span className="border-b-1 border-stone-600 my-5 w-full">
              <input
                type="search"
                placeholder="I'm going to an art exhibition"
                className="rounded-none my-1 typewriter"
              />
            </span>
            <Image
              src={Image4}
              width={250}
              alt="Example"
              className="clip-image"
            />
            <Link
              href="/recommendation"
              className="p-3 mt-5 bg-primary text-primary-content w-30 text-sm text-center button-slide"
            >
              Try It!
            </Link>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-center my-3 text-sm">Create your own freely</h1>
            <span className="border-b-1 border-stone-600 my-5 w-full">
              <input
                type="search"
                placeholder="I'm going picnic!"
                className="rounded-none my-1 typewriter"
              />
            </span>
            <Image
              src={Image3}
              width={250}
              alt="Example"
              className="clip-image"
            />
            <Link
              href="/recommendation"
              className="mt-5 bg-primary text-primary-content w-30 text-sm button-slide"
            >
              Try It!
            </Link>
          </div>
        </div>
      </div>
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage:
            "url(https://tnewties.com/cdn/shop/files/all_pc_3_1400x.jpg)",
        }}
      >
        <div className="hero-overlay opacity-50"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-xl">
            <h1 className="mb-5 text-5xl font-bold">Hack Your Style</h1>
            <p className="mb-5">
              StyleHack is your personal outfit assistant that creates stylish
              looks tailored to your needs. Whether you`re inspired by a certain
              look, dressing for a specific destination, or have a unique
              request in mind, the app curates outfits that match your style and
              situation and provides the links to buy them online. Just upload a
              photo, choose your destination, or describe your vibe — and let
              StyleHack handle the rest. Fashion made easy, personalized, and
              effortless.
            </p>
            <Link href="/recommendation" className="button-slide">
              Create My Style
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
