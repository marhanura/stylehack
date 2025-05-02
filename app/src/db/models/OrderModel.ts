import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb";

interface IOrder {
  userId: ObjectId;
  amount: number;
  status: string;
  paidAt: string;
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
      paidAt: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await collection.insertOne(order);
    return "Order created successfully";
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
