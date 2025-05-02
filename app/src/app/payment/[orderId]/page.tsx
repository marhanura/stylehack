"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const router = useRouter();
  const [link, setLink] = useState("http://localhost:3000")

  useEffect(() => {
    (async () => {
      const { orderId } = await params;
      const resp = await fetch(`http://localhost:3000/api/order/${orderId}`);
      if (!resp.ok) {
        router.push("/");
      }
      const data = await resp.json();
      setLink(data.redirectLink)
    })();
  }, []);


  return (
    <>
      <h1>bayyar woe</h1>
      <h1>{link}</h1>
      <div className="flex justify-center py-5">

      <iframe className="h-150 w-100" src={link} title=""></iframe>
      </div>
    </>
  );
}
