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

export interface IProduct {
  category: string;
  name: string;
  links: string[];
}

export interface IPrompt {
  type: string;
  input: string;
}

export default class RecomendationModel {
  static getCollection() {
    const db = getDB();
    return db.collection<IRecomendation>("Recommendations");
  }

  static async getLoginUserRecommendations(
    userId: string,
    page: string | null
  ) {
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
      {
        $sort: { _id: -1 },
      },
      {
        $facet: {
          data: [{ $skip: currentPage * pageSize }, { $limit: pageSize }],
          total: [{ $count: "count" }],
        },
      },
    ];

    const [result] = await collection.aggregate(pipeline).toArray();

    const data = result.data;
    const total = result.total[0]?.count || 0;
    const totalPage = Math.ceil(total / pageSize);

    return {
      data,
      currentPage: currentPage + 1,
      totalPage,
      total,
    };
  }
}
