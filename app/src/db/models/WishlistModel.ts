import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb";

export interface IWishlist {
  userId: ObjectId;
  recomendationId: ObjectId;
}

export default class WishlistModel {
  static getCollection() {
    const db = getDB();
    return db.collection<IWishlist>("Wishlists");
  }

  static async findOne(recommendationId: ObjectId) {
    const collection = this.getCollection();
    const wishlist = await collection.findOne(recommendationId);
    return wishlist;
  }

  static async createWishlist(payload: IWishlist): Promise<string> {
    const collection = this.getCollection();

    await collection.insertOne(payload);

    return "Successfully added wishlist";
  }
}
