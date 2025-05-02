import Image from "next/image";
import Link from "next/link";
import { IDetail } from "@/app/(auth)/lookbook/page";

interface IStyleCard {
  data: IDetail;
}

export default function RecsCard(data: IStyleCard) {
  const recommendation: IDetail = data.data;

  return (
    <div className="card bg-base-100 h-100 w-full rounded-none">
      {/* <figure>
        <Image
          src={Thumbnail}
          alt="Shoes"
          width={400}
          height={300}
          className="object-cover"
        />
      </figure> */}
      <div className="card-body">
        <div className="badge badge-secondary">
          {recommendation.prompt.type}
        </div>
        <p className="card-title">{recommendation.prompt.input}</p>
        {recommendation.products.map((product) => (
          <div key={product.category}>
            <p>
              {product.category}: {product.name}
            </p>
            <Link href={product.links[0]}>Product 1</Link> /
            <Link href={product.links[1]}>Product 2</Link>
          </div>
        ))}
        {/* <div className="flex flex-row gap-3 my-3 justify-center">
          <Image src={Thumbnail} width={50} height={50} alt="Anak anak" />
          <Image src={Thumbnail} width={50} height={50} alt="Anak anak" />
          <Image src={Thumbnail} width={50} height={50} alt="Anak anak" />
        </div> */}
        <Link href="/recommendation/1" className="btn">
          See Detail
        </Link>
      </div>
    </div>
  );
}
