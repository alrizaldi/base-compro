import type mongoose from "mongoose";

type MongooseConnection =
  ReturnType<typeof mongoose.connect> extends Promise<infer T> ? T : never;

declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: MongooseConnection | null;
    promise: Promise<MongooseConnection> | null;
  };
}

export {};
