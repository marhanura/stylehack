import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { IDetail } from "@/app/(auth)/lookbook/[id]/layout";
import { getBaseUrl } from "@/db/helpers/getBaseUrl";

export interface IStyleCard {
  data: IDetail;
  onDelete?: () => void;
}

export default function WishlistCard(props: IStyleCard) {
  const router = useRouter();
  const wishlist: IDetail = props.data;
  const { onDelete } = props;

  const removeWishlist = async (id: string) => {
    Swal.fire({
      text: "Remove from wishlist?",
      icon: "warning",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(`${getBaseUrl()}/wishlists/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          const data = await res.json();
          Swal.fire({
            text: data.message,
            icon: "error",
            timer: 2000,
          });
          return;
        }
        Swal.fire({
          text: "Removed from wishlist",
          icon: "success",
          timer: 2000,
        });
        if (onDelete) onDelete();
        router.refresh();
      }
    });
  };

  return (
    <div className="card bg-base-100 h-[500px] w-full rounded-none justify-start p-10">
      <div className="flex flex-col justify-start h-full gap-2 my-3">
        <div className="h-[400px] overflow-auto">
          <div className="badge badge-secondary">
            {wishlist.recommendation.prompt.type}
          </div>
          {wishlist.recommendation.prompt.input.includes("cloudinary") ? (
            <Image
              src={wishlist.recommendation.prompt.input}
              width={200}
              height={300}
              alt={wishlist.recommendation.prompt.type}
              className="object-cover my-3 mx-auto my-2"
              style={{ width: "200px", height: "300px" }}
            />
          ) : (
            <p className="my-2">{wishlist.recommendation.prompt.input}</p>
          )}
          {wishlist.recommendation.products?.map((product, index) => (
            <div key={index} className="flex flex-col gap-3">
              <p className="text-sm my-2">
                <span className="badge badge-accent border-none mr-2">
                  {product.category}
                </span>
                <span className="capitalize">{product.name}</span>
              </p>
            </div>
          ))}
        </div>
        <div className="card-actions justify-end">
          <Link
            href={`/lookbook/${wishlist.recommendationId?.toString()}`}
            className="btn"
          >
            See Detail
          </Link>
          <button
            className="btn btn-accent"
            onClick={() => removeWishlist(wishlist._id.toString())}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
