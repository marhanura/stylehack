import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb";
import CustomError from "../helpers/CustomError";
import RecomendationModel from "./RecomendationModel";

export interface IWishlist {
  userId: ObjectId;
  recommendationId: ObjectId;
  createdAt: string;
  updateAt: string;
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

    if (payload.userId.toString() !== recommendation.userId.toString()) {
      throw new CustomError(
        "Not allowed to add another user's recommendation to wishlist",
        403
      );
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

  static async getLoginUserWishlists(userId: string, page: string | null) {
    const collection = this.getCollection();

    const currentPage = page ? Number(page) - 1 : 0;
    const pageSize = 6;

    const pipeline = [
      {
        $match: {
          userId: new ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "Recommendations",
          localField: "recommendationId",
          foreignField: "_id",
          as: "recommendation",
        },
      },
      {
        $unwind: {
          path: "$recommendation",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "Recommendations",
          localField: "recommendation._id",
          foreignField: "recommendationId",
          as: "extraRecommendation",
        },
      },
      {
        $unwind: {
          path: "$extraRecommendation",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          root: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: {
          newRoot: "$root",
        },
      },
      { $sort: { _id: -1 } },
      {
        $skip: currentPage * pageSize,
      },
      {
        $limit: pageSize,
      },
    ];
    const countPipeline = [
      {
        $match: {
          userId: new ObjectId(userId),
        },
      },
      {
        $count: "count",
      },
    ];

    const [data, totalResult] = await Promise.all([
      collection.aggregate(pipeline).toArray(),
      collection.aggregate(countPipeline).toArray(),
    ]);

    const total = totalResult[0]?.count || 0;
    const totalPage = Math.ceil(total / pageSize);

    return { data, currentPage: currentPage + 1, totalPage, total };
  }

  static async getLoginUserWishlistById(wishlistId: string, userId: string) {
    const collection = this.getCollection();
    const wishlists = await collection
      .aggregate([
        {
          $match: {
            _id: new ObjectId(wishlistId),
            userId: new ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "Recommendations",
            localField: "recommendationId",
            foreignField: "_id",
            as: "recommendation",
          },
        },
        {
          $unwind: {
            path: "$recommendation",
          },
        },
        {
          $lookup: {
            from: "Recommendations",
            localField: "recommendation._id",
            foreignField: "recommendationId",
            as: "extraRecommendation",
          },
        },
        {
          $unwind: {
            path: "$extraRecommendation",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            recommendationId: 0,
          },
        },
      ])
      .toArray();

    if (wishlists.length === 0) {
      throw new CustomError("Wishlist not found", 404);
    }
    return wishlists[0];
  }
}
