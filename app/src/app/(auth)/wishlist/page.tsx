"use client";
import { useEffect, useState } from "react";
import { IDetail } from "../lookbook/page";
import WishlistCard from "@/components/WishlistCard";

export default function WishlistPage() {
  const [wishlists, setWishlists] = useState<IDetail[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const fetchWishlists = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/wishlists?page=${currentPage}`
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      setWishlists(data.data);
      setCurrentPage(data.currentPage);
      setTotalPage(data.totalPage);
    } catch (error) {
      console.error("Error fetching wishlists:", error);
    }
  };

  useEffect(() => {
    fetchWishlists();
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
    <div className="h-full bg-[#E7DFD1] pt-25 px-10 flex flex-col">
      <h1 className="text-center mb-5">My Wishlist</h1>
      <div className="grid grid-cols-3 gap-10">
        {wishlists.map((wishlist) => (
          <WishlistCard
            key={wishlist._id.toString()}
            data={wishlist}
            onDelete={fetchWishlists}
          />
        ))}
      </div>
      <div className="join self-center mt-10">
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
  );
}
