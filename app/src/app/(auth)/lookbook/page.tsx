"use client";
import RecsCard from "@/components/RecsCard";

import { useEffect, useState } from "react";
import { IRecomendation } from "./[id]/page";
import { getBaseUrl } from "@/db/helpers/getBaseUrl";

export default function LookbookPage() {
  const [recommendations, setRecommendations] = useState<IRecomendation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const fetchRecommendations = async () => {
    const res = await fetch(
      `${getBaseUrl()}/recommendations?page=${currentPage}`
    );
    if (!res.ok) {
      const err: { message: string } = await res.json();
      throw new Error(err.message);
    }
    const data: {
      data: IRecomendation[];
      currentPage: number;
      totalPage: number;
    } = await res.json();
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
    <div className="min-h-screen pt-25 px-10 flex flex-col">
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
                fetchRecommendation={fetchRecommendations}
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
