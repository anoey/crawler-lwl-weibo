import {
  Timestamp,
  MongoClient,
} from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { config } from "https://deno.land/std@0.171.0/dotenv/mod.ts";

interface Comment {
  _id: { $oid: string };
  content: string;
  user: string;
  time: Timestamp;
}

const configData = await config();

const uri = `mongodb+srv://lwl:${configData["PASSWORD"]}@cluster0.j7pwn6f.mongodb.net/?authMechanism=SCRAM-SHA-1`;
const client = new MongoClient();
await client.connect(uri);

const db = client.database("lwl_weibo");
const commentsCollection = db.collection<Comment>("comments");


export {
commentsCollection
};
export type { Comment };
