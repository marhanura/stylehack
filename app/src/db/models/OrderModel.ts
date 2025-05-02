import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb";

interface IOrder {
  userId: ObjectId;
  amount: number;
  status: string;
  paidAt: string;
  redirectLink: string;
  createdAt: string;
  updatedAt: string;
}

export default class OrderModel {
  static async getCollection() {
    const db = getDB();
    return db.collection("Orders");
  }

  static async createOrder(userId: ObjectId) {
    const collection = await this.getCollection();
    const order: IOrder = {
      userId,
      amount: 99000,
      status: "pending",
      redirectLink: "",
      paidAt: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = await collection.insertOne(order);
    return result;
  }

  static async createMidtransTransaction(orderId: string, name: string, email: string) {
    const resp = await fetch(
      `https://app.sandbox.midtrans.com/snap/v1/transactions`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            `Basic ${process.env.MIDTRANS_SERVER_KEY}`,
        },
        body: JSON.stringify({
          transaction_details: {
            order_id: `stylehack-${orderId}`,
            gross_amount: 99000,
          },
          credit_card: {
            secure: true,
          },
          customer_details: {
            first_name: name,
            email: email,
          },
        }),
      }
    );
    const data: {token: string, redirect_url: string} = await resp.json()
    // console.log(data, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<,,")
    return data
  }

  static async setLink(link: string, orderId: ObjectId){
    const collection = await this.getCollection();
    await collection.updateOne(
      {_id: orderId},
      {$set: {redirectLink: link}}
    )
    return "success change link"
  }

  static async updateStatus(orderId: ObjectId) {
    const collection = await this.getCollection();
    await collection.updateOne(
      { _id: orderId },
      { $set: { status: "paid", paidAt: new Date(), updatedAt: new Date() } }
    );
    return "Order paid successfully";
  }
}
