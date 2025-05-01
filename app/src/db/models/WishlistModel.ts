import { ObjectId } from "mongodb";

export interface IWishlist{
    userId: ObjectId
    recomendationId: ObjectId
}