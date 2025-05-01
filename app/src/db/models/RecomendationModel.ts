import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb";

export interface IRecomendation {
  userId: ObjectId;
  products: IProduct[];
  promptBy: IPrompt;
  recommendationId: ObjectId;
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
            userId: new ObjectId("6810dbfd2e7d4851742daf01"),
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
          },
        },
      ])
      .toArray();
    return recommendations;
  }
}
