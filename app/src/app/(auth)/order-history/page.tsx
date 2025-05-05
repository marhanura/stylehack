"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export interface IOrder {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
  redirectLink: string;
  paidAt: string;
}
export default function OrderHistoryPage() {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [orders, setOrders] = useState<IOrder[]>([
    {
      _id: "",
      amount: 0,
      createdAt: "",
      paidAt: "",
      redirectLink: "",
      status: "",
    },
  ]);

  const fetchData = async () => {
    const res = await fetch(`http://localhost:3000/api/order?p=${page}`);
    if (!res.ok) {
      Swal.fire({
        title: "error",
        icon: "error",
      });
      return;
    }
    const { data, totalPage } = await res.json();
    // console.log(data);
    setTotalPage(totalPage);
    setOrders(data);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <div className="h-full pt-18">
      <h2 className="font-bold text-xl text-center my-5">Payments History</h2>
      {orders.length === 0 ? (
        <p className="text-center my-5">No order yet.</p>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-3xl ">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Paid At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((e, i) => {
                  return (
                    <tr key={i}>
                      <th>{page === 1 ? i + 1 : (page - 1) * 10 + i + 1}</th>
                      <td>
                        {new Date(e.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td>
                        {e.status === "Paid" ? (
                          <p className="px-1.5 border-green-900 border-1 border-solid py-0.5 bg-green-200 rounded-md w-max text-green-900">
                            {e.status}
                          </p>
                        ) : e.status === "Waiting Payment" ? (
                          <p className="px-1.5 border-gray-900 border-1 border-solid py-0.5 bg-gray-200 rounded-md w-max text-gray-900">
                            {e.status}
                          </p>
                        ) : e.status === "Pending" ? (
                          <p className="px-1.5 border-yellow-900 border-1 border-solid py-0.5 bg-yellow-200 rounded-md w-max text-yellow-900">
                            {e.status}
                          </p>
                        ) : e.status === "Expired" ? (
                          <p className="px-1.5 border-red-900 border-1 border-solid py-0.5 bg-red-200 rounded-md w-max text-red-900">
                            {e.status}
                          </p>
                        ) : (
                          e.status
                        )}
                      </td>
                      <td>Rp.{e.amount}</td>
                      <td>
                        {e.status === "Paid"
                          ? `${new Date(e.paidAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}, ${new Date(e.paidAt).toLocaleTimeString(
                              "id-ID",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )} WIB`
                          : "-"}
                      </td>
                      <td>
                        {e.status === "Paid" ? (
                          "-"
                        ) : (
                          <Link
                            href={`/payment/${e._id.toString()}`}
                            className="text-blue-900 hover:underline"
                          >
                            Go to payment page
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="join flex justify-center mt-3 mb-3">
            <button
              className="join-item btn"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              «
            </button>

            <button className="join-item btn">Page {page}</button>
            <button
              className="join-item btn"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPage}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
