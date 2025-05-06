import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb";

export interface IOrder {
  userId: ObjectId;
  amount: number;
  status: string;
  paidAt: string;
  redirectLink: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IOrderWithId extends IOrder {
  _id: ObjectId;
}

export default class OrderModel {
  static getCollection() {
    const db = getDB();
    return db.collection<IOrder>("Orders");
  }

  static async findOne(payload: Partial<IOrderWithId>) {
    const collection = this.getCollection();
    const order = await collection.findOne(payload);
    return order;
  }

  static async find(userId: ObjectId, skip: number) {
    const collection = this.getCollection();

    const orders = await collection
      .aggregate([
        {
          $match: {
            userId: userId,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: 10,
        },
      ])
      .toArray();

    const count = (await collection.countDocuments({ userId: userId })) / 10;

    return { data: orders, totalPage: Math.ceil(count) };
  }

  static async createOrder(userId: ObjectId) {
    const collection = this.getCollection();
    const order: IOrder = {
      userId,
      amount: 99000,
      status: "Waiting Payment",
      redirectLink: "",
      paidAt: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await collection.insertOne(order);
    return result;
  }

  static async createMidtransTransaction(
    orderId: string,
    name: string,
    email: string
  ) {
    const resp = await fetch(
      `https://app.sandbox.midtrans.com/snap/v1/transactions`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${process.env.MIDTRANS_SERVER_KEY}`,
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
    const data: { token: string; redirect_url: string } = await resp.json();
    // console.log(data, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<,,")
    return data;
  }

  static async setLink(link: string, orderId: ObjectId) {
    const collection = this.getCollection();
    await collection.updateOne(
      { _id: orderId },
      { $set: { redirectLink: link } }
    );
    return "success change link";
  }

  static async updateStatusPaid(orderId: ObjectId) {
    const collection = this.getCollection();
    await collection.updateOne(
      { _id: orderId },
      {
        $set: {
          status: "Paid",
          paidAt: new Date().toISOString(),
          updatedAt: new Date(),
        },
      }
    );
    return "Order paid successfully";
  }

  static async updateStatusPending(orderId: ObjectId) {
    const collection = this.getCollection();
    await collection.updateOne(
      { _id: orderId },
      {
        $set: {
          status: "Pending",
          updatedAt: new Date(),
        },
      }
    );
    return "Order pending successfully";
  }

  static async updateStatusExpire() {
    const collection = this.getCollection();
    const twentyFourHoursFromNow = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await collection.updateMany(
      { createdAt: { $lt: twentyFourHoursFromNow } },
      { $set: { status: "Expired", updatedAt: new Date() } }
    );
    return "Order expire successfully";
  }
}
