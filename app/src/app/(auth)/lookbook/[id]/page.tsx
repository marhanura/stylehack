"use client";
import { useEffect, useState } from "react";
// import { IDetail } from "../page";
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
        // const err: { message: string } = await res.json();
        // throw new Error(err.message);
      }
      const data: IRecomendation = await res.json();
      setRecommendation(data);
    };
    fetchRecommendation();
  }, [params]);

  return (
    <div className="h-full pt-25 px-10 mb-10">
      <div className="bg-[#E7DFD1] p-10 flex flex-col">
        <h1 className="text-center mb-5">Recommendation Detail</h1>
        {error? <h1>Error</h1> : recommendation.products?.length === 0 ? (

          <Loading />
        ) : (
          <div className="flex flex-col gap-2">
            <p className="badge badge-secondary">
              {recommendation?.prompt.type}
            </p>
            {recommendation.prompt.input.includes("cloudinary") ? (
              <Image
                src={recommendation.prompt.input}
                width={200}
                height={300}
                alt={recommendation.prompt.type}
                className="object-cover self-center my-2"
                style={{ width: "200px", height: "300px" }}
              />
            ) : (
              <p className="font-bold">{recommendation.prompt.input}</p>
            )}
            {recommendation?.products?.map((product, index) => (
              <div key={index}>
                <p className="text-sm my-2">
                  <span className="badge badge-accent border-none mr-2">
                    {product.category}
                  </span>
                  <span className="font-medium">{product.name}</span>
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
        )}
      </div>
    </div>
  );
}
