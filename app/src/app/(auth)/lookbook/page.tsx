"use client";
import RecsCard from "@/components/RecsCard";
import {
  IExtraRecomendation,
  IPrompt,
  IRecomendation,
} from "@/db/models/RecomendationModel";
import { ObjectId } from "mongodb";
import { useEffect, useState } from "react";

export interface IDetail {
  _id: ObjectId;
  userId: ObjectId;
  recommendationId?: ObjectId;
  recommendation: IRecomendation;
  prompt: IPrompt;
  extraRecommendation?: IExtraRecomendation;
}

export default function LookbookPage() {
  const [recommendations, setRecommendations] = useState<IDetail[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const fetchRecommendations = async () => {
    const res = await fetch(
      `http://localhost:3000/api/recommendations?page=${currentPage}`
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message);
    }
    setRecommendations(data.data);
    setCurrentPage(data.currentPage);
    setTotalPage(data.totalPage);
  };

  useEffect(() => {
    fetchRecommendations();
  }, [currentPage]);

  const nextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  return (
    <div className="h-full pt-25 px-10 h-full flex flex-col">
      <h1 className="text-center my-5 text-2xl font-(family-name:--font-bodoni-moda)">
        My Lookbook
      </h1>
      {recommendations.length === 0 ? (
        <p className="text-center">No recommendations yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-10">
            {recommendations?.map((recommendation) => (
              <RecsCard
                key={recommendation._id.toString()}
                data={recommendation}
              />
            ))}
          </div>
          <div className="join self-center my-10">
            <button
              className="join-item btn"
              disabled={currentPage === 1 ? true : false}
              onClick={() => prevPage()}
            >
              «
            </button>
            <button className="join-item btn">Page {currentPage}</button>
            <button
              className="join-item btn"
              disabled={currentPage === totalPage ? true : false}
              onClick={() => nextPage()}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
