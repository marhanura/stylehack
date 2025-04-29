import { getDB } from "../config/mongodb";
import { hashPassword } from "../helpers/bcrypt";
import CustomError from "../helpers/CustomError";

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

  static async register(payload: IUser): Promise<string> {
    const collection = this.getCollection();

    let user = await collection.findOne({ email: payload.email });
    if (user) {
      throw new CustomError("Email must be unique", 400);
    }

    await collection.insertOne({
      ...payload,
      password: hashPassword(payload.password),
    });

    return "Successfully registered";
  }
}
