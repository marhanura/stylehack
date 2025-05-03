"use client";
import { useEffect, useState } from "react";
import { IDetail } from "../../lookbook/page";
// import { IStyleCard } from "@/components/WishlistCard";
import Link from "next/link";

export default function WishlistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [wishlist, setWishlist] = useState<IDetail[]>([]);
  useEffect(() => {
    const fetchWishlist = async () => {
      const { id } = await params;
      const res = await fetch(`http://localhost:3000/api/wishlists/${id}`);
      const data = await res.json();
      setWishlist(data);
      if (!res.ok) {
        throw new Error(data.message);
      }
    };
    fetchWishlist();
  }, [params]);
  return (
    <div className="h-screen pt-25 px-10">
      <div className="bg-[#E7DFD1] p-10 h-100 flex flex-col">
        <h1 className="text-center mb-5">My Wishlist Detail</h1>
        <p>{wishlist.recommendation?.prompt.type}</p>
        <p>{wishlist.recommendation?.prompt.input}</p>
        {wishlist.recommendation?.products.map((product) => (
          <div key={product.category}>
            <p>
              {product.category}: {product.name}
            </p>
            <Link href={product.links[0]}>Product 1</Link> /
            <Link href={product.links[1]}>Product 2</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
