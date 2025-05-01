import { ObjectId } from "mongodb";

export interface IRecomendation {
  userId: ObjectId
  products: IProduct[]
  promptBy: IPrompt
}

interface IProduct{
    category: string
    name: string
    links: string[]
}

interface IPrompt{
    type: string
    input: string
}

export default class RecomendationModel{
    
}
