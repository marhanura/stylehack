"use client";
import Image from "next/image";
// import ImageLookbook from "../../../../public/image4.webp";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image1 from "@/../public/avatar1.png";
import Image2 from "@/../public/avatar2.png";
import Image3 from "@/../public/avatar3.png";
import { removeToken } from "../../../../actions";
import Swal from "sweetalert2";
import { IUser } from "@/db/models/UserModel";
// import { IWishlistDetail } from "../wishlist/page";
import { IDetail } from "../lookbook/page";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const handleBuy = async () => {
    console.log("belibro");

    const resp = await fetch(`http://localhost:3000/api/order`, {
      method: "POST",
    });
    if (!resp.ok) {
      Swal.fire({
        title: "error",
        icon: "error",
      });
      return;
    }
    const data: { orderId: string } = await resp.json();
    router.push(`/payment/${data.orderId}`);
  };

  const [user, setUser] = useState<IUser>({
    name: "",
    email: "",
    password: "",
    gender: "",
    quota: 0,
    ageRange: "",
  });
  const [lookbook, setLookbook] = useState<IDetail[]>([]);
  console.log("🐄 - ProfilePage - lookbook:", lookbook);
  const [wishlist, setWishlist] = useState<IDetail[]>([]);
  console.log("🐄 - ProfilePage - wishlist:", wishlist);
  const avatars = [Image1, Image2, Image3];
  const randomAvatar = avatars[0];

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`http://localhost:3000/api/user`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      setUser(data);
    };
    const fetchWishlist = async () => {
      const res = await fetch(`http://localhost:3000/api/wishlists`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      setWishlist(data.data);
    };
    const fetchRecommendations = async () => {
      const res = await fetch(`http://localhost:3000/api/recommendations`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      setLookbook(data.data);
    };
    fetchUser();
    fetchWishlist();
    fetchRecommendations();
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
          removeToken();
        }
      })
      .catch((error) => {
        console.log("🐄 - handleLogout - error:", error);
      });
  };

  return (
    <div className="h-screen flex justify-center items-center px-10">
      <div className="bg-[#E7DFD1] py-10 flex flex-col">
        <h1 className="text-center mb-5">Profile</h1>
        <div className="flex flex-row justify-center items-center h-full p-10 gap-5">
          <div className="flex-1 flex flex-col border-r-1 border-black min-h-full gap-2 pr-5">
            <div className="avatar avatar-placeholder flex flex-row gap-3 h-24">
              <div className="bg-neutral text-neutral-content w-34 rounded-full">
                <Image
                  src={Image1}
                  alt="Avatar"
                  width={100}
                  className="rounded-full"
                />
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
                className="progress progress-accent w-60"
                value={user.quota}
                max="10"
              ></progress>
              <span className="text-center ml-5 text-sm">
                {user.quota} token
              </span>
            </div>
            <button
              className="btn"
              onClick={() =>
                (
                  document.getElementById("buy_token") as HTMLDialogElement
                )?.showModal()
              }
            >
              Buy Token
            </button>
            <dialog id="buy_token" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Buy Token</h3>
                <p className="font-bold text-lg">Rp. 99.000</p>
                <p className="py-4">Get 10 tokens for only Rp. 99.000!</p>
                <div className="modal-action flex justify-between">
                  <button className="btn" onClick={handleBuy}>
                    Buy Token
                  </button>
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
          <div className="flex-1 flex flex-col justify-between items-center border-r-1 border-black min-h-full">
            <h1 className="font-bold text-center">Style Lookbook</h1>
            <div className="flex flex-row gap-2">
              {lookbook.slice(0, 3).map((item) => (
                <Link
                  href={`/lookbook/${item._id.toString()}`}
                  className="bg-white p-3 my-3 text-center"
                  key={item._id.toString()}
                >
                  <p>{item.prompt.input}</p>
                </Link>
              ))}
            </div>
            <Link
              href="/lookbook"
              className="p-1 bg-primary text-primary-content w-50 text-sm button-slide"
            >
              View All
            </Link>
          </div>
          <div className="flex-1 flex flex-col justify-between items-center h-full">
            <h1 className="font-bold text-center">Wishlist</h1>
            <div className="flex flex-row gap-2">
              {wishlist.slice(0, 3).map((item) => (
                <Link
                  href={`/wishlist/${item._id.toString()}`}
                  className="bg-white p-3 my-3 text-center"
                  key={item._id.toString()}
                >
                  <p>{item.recommendation.prompt.input}</p>
                </Link>
              ))}
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
