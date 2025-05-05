import { Db, MongoClient } from "mongodb";
import cron from "node-cron"
import OrderModel from "../models/OrderModel";

const uri = process.env.MONGO_DB_LINK;

const client = new MongoClient(uri as string);

let db: Db;

function connect() {
  db = client.db("fproject");
  return db;
}

export function getDB() {
  if (!db) return connect();

  return db;
}

// console.log("JALAN")

cron.schedule('* * * * *', async () => {
  console.log('running a task every minute');
  await OrderModel.updateStatusExpire()
});



