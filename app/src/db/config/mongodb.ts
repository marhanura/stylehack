import { Db, MongoClient } from "mongodb";

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