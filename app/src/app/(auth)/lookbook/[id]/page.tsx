"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Loading from "@/components/Loading";
import Image from "next/image";
import { IProduct } from "@/db/models/RecomendationModel";
import { ObjectId } from "mongodb";
import Swal from "sweetalert2";

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
  useEffect(() => {
    const fetchRecommendation = async () => {
      const { id } = await params;
      const res = await fetch(
        `http://localhost:3000/api/recommendations/${id}`
      );
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
    fetchRecommendation();
  }, [params]);

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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
