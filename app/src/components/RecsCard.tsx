"use client";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import { IRecomendation } from "@/app/(auth)/lookbook/[id]/page";
import { getBaseUrl } from "@/db/helpers/getBaseUrl";

interface IStyleCard {
  data: IRecomendation;
  fetchRecommendation: () => void;
}

export default function RecsCard(data: IStyleCard) {
  const recommendation: IRecomendation = data.data;

  const addToWishlist = async (id: string) => {
    const res = await fetch(`${getBaseUrl()}/wishlists`, {
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
        timer: 2000,
      });
      return;
    }
    Swal.fire({
      text: "Added to wishlist",
      icon: "success",
      timer: 2000,
    });
    data.fetchRecommendation();
  };

  const removeFromWishlist = async (recommendationId: string) => {
    const res = await fetch(`${getBaseUrl()}/wishlists`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recommendationId }),
    });
    if (!res.ok) {
      const data: { message: string } = await res.json();
      Swal.fire({
        text: data.message,
        icon: "error",
        timer: 2000,
      });
      return;
    }
    Swal.fire({
      text: "Removed from wishlist",
      icon: "success",
      timer: 2000,
    });
    data.fetchRecommendation();
  };

  return (
    <div className="card bg-base-100 h-[500px] w-full rounded-none justify-start p-10">
      <div className="flex flex-col justify-start h-full gap-2 my-3">
        <div className="h-[400px] overflow-auto custom-scrollbar">
          <div className="badge badge-secondary rounded-none">
            {recommendation.prompt.type}
          </div>
          {recommendation.prompt.input.includes("cloudinary") ? (
            <Image
              src={recommendation.prompt.input}
              width={200}
              height={300}
              alt={recommendation.prompt.type}
              className="object-cover my-3 mx-auto"
              style={{ width: "200px", height: "300px" }}
            />
          ) : (
            <p className="my-3 text-lg capitalize">
              {recommendation.prompt.input}
            </p>
          )}
          {recommendation.products?.map((product, index: number) => (
            <div key={index} className="flex flex-col gap-3">
              <p className="text-sm my-2">
                <span className="badge badge-accent border-none mr-2 rounded-none">
                  {product.category}
                </span>
                <span className="capitalize">{product.name}</span>
              </p>
            </div>
          ))}
        </div>
        <div className="card-actions justify-end mt-3">
          <Link
            href={`/lookbook/${recommendation._id}`}
            className="btn btn-secondary rounded-none border-none shadow-none"
          >
            See Detail
          </Link>
          <button
            className="btn btn-accent rounded-none border-none shadow-none"
            onClick={
              recommendation.isWishlisted
                ? () => removeFromWishlist(recommendation._id.toString())
                : () => addToWishlist(recommendation._id.toString())
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={recommendation.isWishlisted ? "currentColor" : "none"}
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
