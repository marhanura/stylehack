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
  recommendation: IRecomendation;
  prompt: IPrompt;
  extraRecommendation?: IExtraRecomendation;
}

export default function LookbookPage() {
  const [recommendations, setRecommendations] = useState<IDetail[]>([]);
  useEffect(() => {
    const fetchRecommendations = async () => {
      const res = await fetch(`http://localhost:3000/api/recommendations`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      setRecommendations(data);
    };
    fetchRecommendations();
  }, []);
  return (
    <div className="h-full bg-[#E7DFD1] pt-25 px-10 h-full flex flex-col">
      <h1 className="text-center mb-5">My Lookbook</h1>
      <div className="grid grid-cols-3 gap-10">
        {recommendations.map((recommendation) => (
          <RecsCard key={recommendation._id.toString()} data={recommendation} />
        ))}
      </div>
    </div>
  );
}
