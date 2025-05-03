"use client";
import { useEffect, useState } from "react";
import { IDetail } from "../lookbook/page";
import WishlistCard from "@/components/WishlistCard";

export default function WishlistPage() {
  const [wishlists, setWishlists] = useState<IDetail[]>([]);
  const fetchWishlists = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/wishlists");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      setWishlists(data);
    } catch (error) {
      console.error("Error fetching wishlists:", error);
    }
  };

  useEffect(() => {
    fetchWishlists();
  }, []);

  return (
    <div className="h-full bg-[#E7DFD1] pt-25 px-10 flex flex-col">
      <h1 className="text-center mb-5">My Wishlist</h1>
      <div className="grid grid-cols-3 gap-10">
        {wishlists.map((wishlist) => (
          <WishlistCard
            key={wishlist._id.toString()}
            data={wishlist}
            onDelete={fetchWishlists}
          />
        ))}
      </div>
    </div>
  );
}
