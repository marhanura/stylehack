import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb";
import CustomError from "../helpers/CustomError";
import RecomendationModel from "./RecomendationModel";

export interface IWishlist {
  userId: ObjectId;
  recommendationId: ObjectId;
}

export default class WishlistModel {
  static getCollection() {
    const db = getDB();
    return db.collection<IWishlist>("Wishlists");
  }

  static async findOne(_id: ObjectId) {
    const collection = this.getCollection();
    const wishlist = await collection.findOne(_id);
    return wishlist;
  }

  static async createWishlist(payload: IWishlist): Promise<string> {
    const collection = this.getCollection();
    const recommendationCollection = RecomendationModel.getCollection();

    const recommendation = await recommendationCollection.findOne({
      _id: payload.recommendationId,
    });
    if (!recommendation) {
      throw new CustomError("recommendation is not found", 404);
    }

    const wishlist = await collection.findOne({
      recommendationId: payload.recommendationId,
      userId: payload.userId,
    });
    if (wishlist) {
      throw new CustomError("recommendation is already in wishlist", 400);
    }

    await collection.insertOne(payload);

    return "Successfully added wishlist";
  }

  static async deleteWishlist(id: ObjectId) {
    const collection = this.getCollection();
    const result = await collection.deleteOne({ _id: id });
    return result;
  }
}
