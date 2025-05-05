import { Metadata } from "next";
import { cookies } from "next/headers";
import { IDetail } from "../../lookbook/page";

export interface IParams {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(props: IParams): Promise<Metadata> {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("access_token");
  try {
    const { id } = await props.params;
    const res = await fetch(`http://localhost:3000/api/wishlists/${id}`, {
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
    console.log("🐄 - generateMetadata - product:", product);
    if (product.recommendation.prompt.type === "image") {
      return {
        title: `Style by image - StyleHack`,
        openGraph: {
          images: [product.recommendation.prompt.input],
        },
      };
    } else {
      return {
        title: `Style by ${product.recommendation.prompt.type} - StyleHack`,
        description: product.recommendation.prompt.input,
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
