import { ObjectId } from "mongodb";
import { Metadata } from "next";

import { cookies } from "next/headers";
import { IRecomendation } from "./page";
import { IExtraRecomendation, IPrompt } from "@/db/models/RecomendationModel";
import { getBaseUrl } from "@/db/helpers/getBaseUrl";

export interface IDetail {
  _id: ObjectId;
  userId: ObjectId;
  recommendationId?: ObjectId;
  recommendation: IRecomendation;
  prompt: IPrompt;
  extraRecommendation?: IExtraRecomendation;
}

export interface IParams {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(props: IParams): Promise<Metadata> {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("access_token");
  try {
    const { id } = await props.params;
    const res = await fetch(`${getBaseUrl()}/recommendations/${id}`, {
      headers: {
        Cookie: `access_token=${access_token?.value}`,
      },
    });
    if (!res.ok) {
      if (res.status === 404) {
        return {
          title: "Recommendation not found - StyleHack",
          description: "Recommendation not found",
        };
      }
      throw new Error("Metadata fetch failed");
    }
    const product: IDetail = await res.json();
    if (product.prompt.type === "image") {
      return {
        title: `Your Recommendation - StyleHack`,
        openGraph: {
          images: [product.prompt.input],
        },
      };
    } else {
      return {
        title: `Your Recommendation - StyleHack`,
        description: product.prompt.input,
      };
    }
  } catch (error) {
    console.error("Error generating metadata", error);
    return {
      title: "Error - StyleHack",
      description: "An error occurred while fetching product data",
    };
  }
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
