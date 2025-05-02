"use client";
import { useEffect, useState } from "react";
import { IDetail } from "../page";

export default function RecDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [recommendation, setRecommendation] = useState<IDetail[]>([]);
  useEffect(() => {
    const fetchRecommendation = async () => {
      const { id } = await params;
      const res = await fetch(
        `http://localhost:3000/api/recommendations/${id}`
      );
      const data = await res.json();
      setRecommendation(data);
      if (!res.ok) {
        throw new Error(data.message);
      }
    };
    fetchRecommendation();
  }, [params]);

  console.log("🐄 - recommendation:", recommendation);
  // belum bisa ygy
  return (
    <div className="h-screen pt-25 px-10">
      <div className="bg-[#E7DFD1] p-10 h-100 flex flex-col">
        <h1 className="text-center mb-5">Recommendation Detail</h1>
      </div>
    </div>
  );
}
