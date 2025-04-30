import Navbar from "@/components/Navbar";
import Image from "next/image";
import ImageHistory from "../../../public/image4.webp";
import ImageWishlist from "../../../public/image3.webp";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="h-screen">
      <Navbar />
      <div className="m-10 bg-[#E7DFD1] p-10 h-100 flex flex-col">
        <h1 className="text-center mb-5">Profile</h1>
        <div className="flex flex-row justify-center items-center h-full">
          <div className="flex-1 flex flex-col border-r-1 border-black h-full gap-3">
            <div className="rounded w-20 h-20 bg-primary"></div>
            <h1>Wanda</h1>
            <p>wanda@mail.com</p>
            <div>
              <h1 className="font-bold">Membership Status:</h1>
              <p>Free</p>
            </div>
            <div>
              <h1 className="font-bold">Available Tokens</h1>
              <progress
                className="progress progress-accent w-56"
                value="70"
                max="100"
              ></progress>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-between items-center border-r-1 border-black h-full">
            <h1 className="font-bold text-center">Style History</h1>
            <div className="flex flex-row gap-2">
              <Link href="/recommendation/1" className="profile-image">
                <Image src={ImageHistory} alt="History" width={100} />
              </Link>
              <Link href="/recommendation/1" className="profile-image">
                <Image src={ImageHistory} alt="History" width={100} />
              </Link>
              <Link href="/recommendation/1" className="profile-image">
                <Image src={ImageHistory} alt="History" width={100} />
              </Link>
            </div>
            <Link
              href="/users/recommendation"
              className="p-1 bg-primary text-primary-content w-50 text-sm button-slide"
            >
              View All
            </Link>
          </div>
          <div className="flex-1 flex flex-col justify-between items-center h-full">
            <h1 className="font-bold text-center">Wishlist</h1>
            <div className="flex flex-row gap-2">
              <Link href="/wishlist/1" className="profile-image">
                <Image src={ImageWishlist} alt="History" width={100} />
              </Link>
              <Link href="/wishlist/1" className="profile-image">
                <Image src={ImageWishlist} alt="History" width={100} />
              </Link>
              <Link href="/wishlist/1" className="profile-image">
                <Image src={ImageWishlist} alt="History" width={100} />
              </Link>
            </div>
            <Link
              href="/users/wishlist"
              className="p-1 bg-primary text-primary-content w-50 text-sm button-slide"
            >
              View All
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
