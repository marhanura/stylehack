"use client";
import { useEffect, useState } from "react";
import { IDetail } from "../../lookbook/page";
// import { IStyleCard } from "@/components/WishlistCard";
import Link from "next/link";
import Loading from "@/components/Loading";
import Image from "next/image";

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
    <div className="h-full pt-25 px-10 mb-10">
      <div className="bg-[#E7DFD1] p-10 h-full flex flex-col">
        <h1 className="text-center mb-5">My Wishlist Detail</h1>
        {wishlist.recommendation?.length === 0 ? (
          <Loading />
        ) : (
          <div className="flex flex-col gap-2">
            <p className="badge badge-secondary">
              {wishlist.recommendation?.prompt.type}
            </p>
            {wishlist.recommendation?.prompt.input.includes("cloudinary") ? (
              <Image
                src={wishlist.recommendation?.prompt.input}
                width={200}
                height={300}
                alt={wishlist.recommendation?.prompt.type}
                className="object-cover self-center my-2"
                style={{ width: "200px", height: "300px" }}
              />
            ) : (
              <p className="font-bold">
                {wishlist.recommendation?.prompt.input}
              </p>
            )}
            {wishlist.recommendation?.products?.map((product, index) => (
              <div key={index}>
                <p>
                  {product.category}: {product.name}
                </p>
                <Link href={product.links[0]}>Product 1</Link> /
                {/* <Link href={product.links[1]}>Product 2</Link> */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
