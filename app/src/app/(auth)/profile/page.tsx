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
import Loading from "@/components/Loading";

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
  const [wishlist, setWishlist] = useState<IDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const avatars = [Image1, Image2, Image3];
  const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`http://localhost:3000/api/user`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      setUser(data);
      setLoading(false);
    };
    const fetchWishlist = async () => {
      const res = await fetch(`http://localhost:3000/api/wishlists`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      setWishlist(data.data);
      setLoading(false);
    };
    const fetchRecommendations = async () => {
      const res = await fetch(`http://localhost:3000/api/recommendations`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      setLookbook(data.data);
      setLoading(false);
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
    <div className="min-h-full flex flex-row pt-25 px-5 pb-10">
      <div className="flex-1 flex flex-col justify-between items-center p-5">
        <div className="bg-[#E7DFD1] w-full h-100 p-10 flex flex-col">
          <h1 className="text-center mb-5 font-bold">Profile</h1>
          {loading && <Loading />}
          <div className="flex flex-row justify-center items-center h-full">
            <div className="flex-1 flex flex-col justify-between min-h-full gap-2 w-full">
              <div className="avatar avatar-placeholder flex flex-row gap-3 h-24">
                <div className="bg-neutral text-neutral-content w-34 rounded-full">
                  <Image
                    src={randomAvatar}
                    alt="Avatar"
                    width={100}
                    className="rounded-full"
                  />
                </div>
                <div className="flex flex-col justify-start items-start w-full">
                  <h1 className="text-left w-full">{user.name}</h1>
                  <p className="text-left w-full">{user.email}</p>
                  <p className="text-left w-full capitalize">
                    {user.gender} - {user.ageRange}
                  </p>
                </div>
              </div>
              <p className="mt-5">Available tokens: {user.quota} token</p>
              <div className="flex flex-row justify-between items-center w-full gap-3">
                <Link href="/order-history" className="button-slide flex-1">
                  My Order
                </Link>
                <button
                  className="button-slide flex-1"
                  onClick={() =>
                    (
                      document.getElementById("buy_token") as HTMLDialogElement
                    )?.showModal()
                  }
                >
                  Buy Token
                </button>
              </div>
              <dialog id="buy_token" className="modal">
                <div className="modal-box rounded-none">
                  <h3 className="font-bold text-lg">Buy Token</h3>
                  <p className="font-bold text-lg">Rp. 99.000</p>
                  <p className="py-4">Get 10 tokens for only Rp. 99.000!</p>
                  <div className="modal-action flex justify-between">
                    <button className="button-slide" onClick={handleBuy}>
                      Buy Token
                    </button>
                    <form method="dialog">
                      <button className="button-slide">Cancel</button>
                    </form>
                  </div>
                </div>
              </dialog>
              <button className="button-slide" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between items-center p-5">
        <div className="bg-[#E7DFD1] w-full h-100 py-10 flex flex-col items-center justify-between">
          <h1 className="font-bold text-center flex-1">Style Lookbook</h1>
          {loading ? (
            <Loading />
          ) : (
            <div className="flex flex-row gap-2 flex-5 justify-between">
              {lookbook.length === 0 ? (
                <p>No style yet.</p>
              ) : (
                <div className="flex flex-col justify-between">
                  <div className="flex flex-row gap-2  justify-center items-center">
                    {lookbook.slice(0, 3).map((item) => (
                      <Link
                        href={`/lookbook/${item._id.toString()}`}
                        className="bg-white p-1 my-3 text-center justify-center items-center"
                        key={item._id.toString()}
                      >
                        {item.prompt.input.includes("cloudinary") ? (
                          <Image
                            src={item.prompt.input}
                            width={100}
                            height={150}
                            alt={item.prompt.type}
                            className="object-cover"
                            style={{ width: "100px", height: "150px" }}
                          />
                        ) : (
                          <div className="w-[100px] h-[150px] break-keep flex flex-col items-center justify-center text-sm">
                            <p className="font-bold">{item.prompt.type}:</p>
                            <p>{item.prompt.input}</p>
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/lookbook"
                    className="p-1 bg-primary text-primary-content w-50 text-sm button-slide self-center"
                  >
                    View All
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between items-center p-5">
        <div className="bg-[#E7DFD1] w-full h-100 py-10 flex flex-col items-center justify-between">
          <h1 className="font-bold text-center flex-1">Style Wishlist</h1>
          {loading ? (
            <Loading />
          ) : (
            <div className="flex flex-row gap-2 flex-5 justify-between">
              {wishlist.length === 0 ? (
                <p>No wishlist yet.</p>
              ) : (
                <div className="flex flex-col justify-between">
                  <div className="flex flex-row gap-2 justify-center items-center">
                    {wishlist.slice(0, 3).map((item) => (
                      <Link
                        href={`/wishlist/${item._id.toString()}`}
                        className="bg-white p-1 my-3 text-center justify-center items-center"
                        key={item._id.toString()}
                      >
                        {item.recommendation.prompt.input.includes(
                          "cloudinary"
                        ) ? (
                          <Image
                            src={item.recommendation.prompt.input}
                            width={100}
                            height={150}
                            alt={item.recommendation.prompt.type}
                            className="object-cover"
                            style={{ width: "100px", height: "150px" }}
                          />
                        ) : (
                          <div className="w-[100px] h-[150px] break-keep flex flex-col items-center justify-center text-sm">
                            <p className="font-bold">
                              {item.recommendation.prompt.type}:
                            </p>
                            <p>{item.recommendation.prompt.input}</p>
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/wishlist"
                    className="p-1 bg-primary text-primary-content w-50 text-sm button-slide self-center"
                  >
                    View All
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
