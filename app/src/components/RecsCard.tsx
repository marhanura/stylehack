"use client";
import Image from "next/image";
import Link from "next/link";
import { IDetail } from "@/app/(auth)/lookbook/page";
import Swal from "sweetalert2";

interface IStyleCard {
  data: IDetail;
}

export default function RecsCard(data: IStyleCard) {
  const recommendation: IDetail = data.data;

  const addToWishlist = async (id: string) => {
    const res = await fetch("/api/wishlists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recommendationId: id }),
    });
    if (!res.ok) {
      const data = await res.json();
      Swal.fire({
        text: data.message,
        icon: "error",
      });
      return;
    }
    Swal.fire({
      text: "Added to wishlist",
      icon: "success",
    });
  };

  return (
    <div className="card bg-base-100 h-100 w-full rounded-none">
      {/* <figure>
        <Image
          src={Thumbnail}
          alt="Shoes"
          width={400}
          height={300}
          className="object-cover"
        />
      </figure> */}
      <div className="card-body">
        <div className="badge badge-secondary">
          {recommendation.prompt.type}
        </div>
        <p className="card-title">{recommendation.prompt.input}</p>
        {recommendation.products.map((product) => (
          <div key={product.category}>
            <p>
              {product.category}: {product.name}
            </p>
            <Link href={product.links[0]}>Product 1</Link> /
            <Link href={product.links[1]}>Product 2</Link>
          </div>
        ))}
        <div className="card-actions justify-end">
          <Link href={`/lookbook/${recommendation._id}`} className="btn">
            See Detail
          </Link>
          <button
            className="btn btn-accent"
            onClick={() => addToWishlist(recommendation._id.toString())}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
