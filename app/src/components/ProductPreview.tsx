"use client";
import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import Image from "next/image";

interface Meta {
  title?: string;
  image?: string;
  description?: string;
  price?: string;
}

export default function ProductPreview({ url }: { url: string }) {
  const [meta, setMeta] = useState<Meta>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    const fetchMetadata = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/recommendations`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error ${response.status}`);
        }

        const data = await response.json();
        console.log("Received metadata:", data.metadata);

        if (data.metadata) {
          setMeta(data.metadata);
        } else {
          setError("No metadata found");
        }
      } catch (err: unknown) {
        console.error("Error fetching metadata:", err);
        const message = err instanceof Error ? err.message : String(err);
        setError(message || "Failed to load product information");
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [url]);

  useEffect(() => {
    console.log("Current meta state:", meta);
  }, [meta]);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="border p-4 rounded shadow bg-red-50">
        <p className="text-red-500 text-sm">{error}</p>
        <a
          href={url}
          className="text-blue-500 underline text-sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          View product on retailer site
        </a>
      </div>
    );
  }

  const isLocalImage = (path?: string) => {
    if (!path) return false;
    return path.startsWith("/");
  };

  return (
    <div className="border p-4 rounded shadow max-w-xs">
      {meta.image && (
        <div className="relative h-36 mb-2">
          <Image
            src={meta.image}
            alt={meta.title || "Product"}
            fill
            className="object-contain"
            {...(isLocalImage(meta.image) ? {} : { sizes: "100vw" })}
          />
        </div>
      )}
      {meta.title && <h3 className="font-bold text-sm mt-2">{meta.title}</h3>}
      {meta.price ? (
        <p className="text-green-600 font-semibold text-sm">{meta.price}</p>
      ) : (
        <p className="text-gray-500 text-sm">Price not available</p>
      )}
      <a
        href={url}
        className="text-blue-500 underline text-xs mt-2 block"
        target="_blank"
        rel="noopener noreferrer"
      >
        View details
      </a>
    </div>
  );
}
