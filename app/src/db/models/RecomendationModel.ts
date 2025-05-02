import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb";

export interface IExtraRecomendation {
  userId: ObjectId;
  prompt: IPrompt;
  products: IProduct[];
}

export interface IRecomendation {
  userId: ObjectId;
  prompt: IPrompt;
  products: IProduct[];
  extraRecommendation?: IExtraRecomendation;
}

interface IProduct {
  category: string;
  name: string;
  links: string[];
}

interface IPrompt {
  type: string;
  input: string;
}

export default class RecomendationModel {
  static getCollection() {
    const db = getDB();
    return db.collection<IRecomendation>("Recommendations");
  }

  static async getLoginUserRecommendations(userId: string) {
    const collection = this.getCollection();
    const recommendations = await collection
      .aggregate([
        {
          $match: {
            userId: new ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "Recommendations",
            localField: "_id",
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
          $match: {
            recommendationId: {
              $exists: false,
            },
          },
        },
        {
          $project: {
            "extraRecommendation.recommendationId": 0,
            "extraRecommendation._id": 0,
          },
        },
      ])
      .toArray();
    return recommendations;
  }
}
