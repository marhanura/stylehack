import { ObjectId } from "mongodb";
import {
  Model,
  IMongoloquentSchema,
  IMongoloquentTimestamps,
} from "mongoloquent";

export interface IUser extends IMongoloquentSchema, IMongoloquentTimestamps {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  gender: string;
  quota: number;
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default class User extends Model<IUser> {
  /**
   * The attributes of the model.
   *
   * @var IUser
   */
  static $schema: IUser;

  /**
   * The collection associated with the model.
   *
   * @var string
   */
  static $collection: string = "Users";
}
