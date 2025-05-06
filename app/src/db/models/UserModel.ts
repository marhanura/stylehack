import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb";
import { comparePassword, hashPassword } from "../helpers/bcrypt";
import CustomError from "../helpers/CustomError";
import { signToken } from "../helpers/jose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  gender: string;
  quota: number;
  ageRange: string;
}

export interface IUserwithId extends IUser {
  _id: ObjectId;
}

export interface ILogin {
  email: string;
  password: string;
}

export default class UserModel {
  static getCollection() {
    const db = getDB();
    return db.collection<IUser>("Users");
  }

  static async findOne(payload: Partial<IUserwithId>) {
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

  static async delete(id: ObjectId) {
    const collection = this.getCollection();
    const result = await collection.deleteOne({ _id: id });
    return result;
  }

  static async login(payload: ILogin) {
    const collection = this.getCollection();

    const user = await collection.findOne({ email: payload.email });
    if (!user) throw new CustomError("Invalid email/password", 401);

    const isValid = comparePassword(payload.password, user.password);
    if (!isValid) throw new CustomError("Invalid email/password", 401);

    const token = await signToken({
      _id: user._id.toString(),
      email: user.email,
    });

    return token;
  }

  static async addQuota(_id: ObjectId, quota: number) {
    const collection = this.getCollection();

    await collection.updateOne({ _id: _id }, { $set: { quota: quota } });
  }

  static async decreaseQuota(_id: ObjectId) {
    const collection = this.getCollection();
    const user = await collection.findOne({ _id });
    if (user) {
      await collection.updateOne(
        { _id: _id },
        { $set: { quota: user?.quota - 1 } }
      );
    }
  }
}
