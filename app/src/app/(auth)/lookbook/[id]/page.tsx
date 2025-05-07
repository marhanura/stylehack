"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Loading from "@/components/Loading";
import Image from "next/image";
import { IProduct } from "@/db/models/RecomendationModel";
import { ObjectId } from "mongodb";
import Swal from "sweetalert2";
import { getBaseUrl } from "@/db/helpers/getBaseUrl";

export interface IRecomendation {
  _id: string;
  userId: string;
  prompt: { type: string; input: string };
  products: IProduct[];
  extraRecommendation?: IExtraRecommendation;
  isWishlisted: boolean;
}

interface IExtraRecommendation {
  userId: ObjectId;
  prompt: { type: string; input: string };
  products: IProduct[];
}

export default function RecDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [recommendation, setRecommendation] = useState<IRecomendation>({
    _id: "",
    userId: "",
    prompt: { type: "", input: "" },
    products: [],
    isWishlisted: false,
  });
  const [error, setError] = useState(false);

  const fetchRecommendation = async () => {
    const { id } = await params;
    const res = await fetch(`${getBaseUrl()}/recommendations/${id}`);
    if (!res.ok) {
      Swal.fire({
        title: "Not found",
        icon: "error",
      });
      setError(true);
      return;
    }
    const data: IRecomendation = await res.json();
    setRecommendation(data);
  };
  useEffect(() => {
    fetchRecommendation();
  }, [params]);

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
      });
      return;
    }
    Swal.fire({
      text: "Added to wishlist",
      icon: "success",
    });
    fetchRecommendation();
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
      });
      return;
    }
    Swal.fire({
      text: "Removed from wishlist",
      icon: "success",
    });
    fetchRecommendation();
  };

  const recDetail = () => {
    return (
      <div>
        <Link
          href="/lookbook"
          className="btn btn-content shadow-none mb-5 w-30 h-[30px] p-2 absolute top-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>{" "}
          Lookbook
        </Link>
        <Link
          href="/wishlist"
          className="btn btn-content shadow-none mb-5 w-25 h-[30px] p-2 absolute top-10 right-10"
        >
          Wishlist{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </Link>
        {recommendation?.products?.map((product, index) => (
          <div key={index}>
            <p className="text-sm my-2">
              <span className="badge badge-accent border-none mr-2">
                {product.category}
              </span>
              <span className="font-medium capitalize">{product.name}</span>
            </p>
            {product.links?.map((link, index) => (
              <Link
                key={index}
                className="text-sm py-1 px-2 underline"
                href={link}
                target="_blank"
              >
                Product {index + 1}
              </Link>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-25 px-25 mb-10">
      {error ? (
        <h1>Error</h1>
      ) : recommendation.products?.length === 0 ? (
        <Loading />
      ) : (
        <div>
          {recommendation.prompt.input.includes("cloudinary") ? (
            <div className="card lg:card-side bg-base-100 shadow-sm rounded-none ">
              <figure className="w-100">
                <Image
                  src={recommendation.prompt.input}
                  alt="Image recommendation"
                  width={300}
                  height={200}
                />
              </figure>
              <div className="w-full p-10 flex flex-col justify-start gap-3">
                <p className="badge badge-secondary self-center">
                  {recommendation?.prompt.type}
                </p>
                <p className="text-center text-lg mb-3">
                  Recommendation Detail
                </p>
                {recDetail()}
              </div>
              <button
                className="btn btn-accent "
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
          ) : (
            <div className="card bg-base-100 shadow-sm rounded-none flex flex-col">
              <div className="card-body w-full p-10">
                <p className="badge badge-secondary self-center">
                  {recommendation?.prompt.type}
                </p>
                <p className="text-center text-lg mb-3">
                  Recommendation Detail
                </p>
                <p className="font-medium text-center text-xl mb-3 capitalize">
                  {recommendation?.prompt.input}
                </p>
                {recDetail()}
              </div>
              <button
                className="btn btn-accent "
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
          )}
        </div>
      )}
    </div>
  );
}
