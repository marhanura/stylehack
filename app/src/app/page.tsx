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
            <input
              type="search"
              placeholder="Barbie look"
              className="rounded-none border-b-1 border-stone-600 w-full my-5 typewriter"
            />
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
            <input
              type="search"
              placeholder="I'm going to an art exhibition"
              className="rounded-none border-b-1 border-stone-600 w-full my-5 typewriter"
            />
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
            <input
              type="search"
              placeholder="I'm going picnic!"
              className="rounded-none border-b-1 border-stone-600 w-full my-5 typewriter"
            />
            <Image
              src={Image3}
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
        </div>
      </div>
      {/* <div className="carousel w-full mb-10">
        <div id="slide1" className="carousel-item relative w-full">
          <Image
            alt="Carousel"
            src="https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp"
            className="w-full"
            width={1920}
            height={500}
          />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide4" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide2" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
        <div id="slide2" className="carousel-item relative w-full">
          <Image
            alt="Carousel"
            src="https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp"
            className="w-full"
            width={1920}
            height={500}
          />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide1" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide3" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
        <div id="slide3" className="carousel-item relative w-full">
          <Image
            alt="Carousel"
            src="https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp"
            className="w-full"
            width={1920}
            height={500}
          />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide2" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide4" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
        <div id="slide4" className="carousel-item relative w-full">
          <Image
            alt="Carousel"
            src="https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp"
            className="w-full"
            width={1920}
            height={500}
          />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide3" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide1" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
      </div> */}
      {/* <p>Tes</p> */}
    </div>
  );
}
