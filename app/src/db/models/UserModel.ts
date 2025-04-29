import { getDB } from "../config/mongodb";

export interface IUser {
  name: string;
  email: string;
  password: string;
  gender: string;
  quota: number;
  isPremium: boolean;
}

export default class UserModel {
  static getCollection() {
    const db = getDB();
    return db.collection<IUser>("Users");
  }

  static async findOne(payload: Partial<IUser>) {
    const collection = this.getCollection();
    const users = await collection.findOne(payload);
    return users;
  }
}
