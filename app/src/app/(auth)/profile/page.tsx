"use client";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import ImageHistory from "../../../../public/image4.webp";
import ImageWishlist from "../../../../public/image3.webp";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image1 from "@/../public/avatar1.png";
import Image2 from "@/../public/avatar2.png";
import Image3 from "@/../public/avatar3.png";
import { removeToken } from "../../../../actions";
import Swal from "sweetalert2";

export default function ProfilePage() {
  const [user, setUser] = useState({});
  const avatars = [Image1, Image2, Image3];
  const randomAvatar = useState(
    () => avatars[Math.floor(Math.random() * avatars.length)]
  );

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`http://localhost:3000/api/user`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      setUser(data);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    Swal.fire({
      text: "Are you sure you want to log out?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Log Out",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          console.log("mau logout");
          removeToken();
        }
      })
      .catch((error) => {
        console.log("🐄 - handleLogout - error:", error);
      });
  };

  return (
    <div className="h-screen">
      <Navbar />
      <div className="m-10 bg-[#E7DFD1] p-10 h-100 flex flex-col">
        <h1 className="text-center mb-5">Profile</h1>
        <div className="flex flex-row justify-center items-center h-full">
          <div className="flex-1 flex flex-col border-r-1 border-black h-full gap-2 pr-5">
            <div className="avatar avatar-placeholder flex flex-row gap-3 h-24">
              <div className="bg-neutral text-neutral-content w-34 rounded-full">
                <Image
                  src={randomAvatar[0]}
                  alt="Avatar"
                  width={100}
                  className="rounded-full"
                />
                {/* <span className="text-s">{user.name}</span> */}
              </div>
              <div className="flex flex-col justify-start items-start w-full">
                <h1 className="text-left w-full">{user.name}</h1>
                <p className="text-left w-full">{user.email}</p>
                <p className="text-left w-full capitalize">
                  {user.gender} - Adult
                </p>
              </div>
            </div>
            <div>
              <h1 className="font-bold mt-5">Available Tokens</h1>
              <progress
                className="progress progress-accent w-70"
                value={user.quota}
                max="10"
              ></progress>
              <span className="text-center ml-5 text-sm">
                {user.quota} token
              </span>
            </div>
            <button
              className="btn"
              onClick={() => document.getElementById("my_modal_1").showModal()}
            >
              Buy Token
            </button>
            <dialog id="my_modal_1" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Buy Token</h3>
                <p className="font-bold text-lg">Rp. 99.000</p>
                <p className="py-4">Get 10 tokens for only Rp. 99.000!</p>
                <div className="modal-action flex justify-between">
                  <button className="btn">Buy Token</button>
                  <form method="dialog">
                    <button className="btn">Cancel</button>
                  </form>
                </div>
              </div>
            </dialog>
            <button className="btn" onClick={handleLogout}>
              Log Out
            </button>
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
              href="/history"
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
              href="/wishlist"
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
