import { column, Schema, Table } from "@powersync/react-native";

export const LISTS_TABLE = "lists";
export const TODOS_TABLE = "todos";

const todos = new Table(
  {
    list_id: column.text,
    created_at: column.text,
    completed_at: column.text,
    description: column.text,
    created_by: column.text,
    completed_by: column.text,
    completed: column.integer,
  },
  { indexes: { list: ["list_id"] } }
);

const lists = new Table({
  created_at: column.text,
  name: column.text,
  owner_id: column.text,
});

const profiles = new Table(
  {
    user_id: column.text,
    username: column.text,
    full_name: column.text,
    avatar_url: column.text,
    has_completed_survey: column.integer, // 0 or 1
    currency_code: column.text,
    created_at: column.text ,
    updated_at: column.text,
  },
  {
    indexes: {
      
      id: ["id"],
      user_id: ["user_id"],
    },
  }
);

export const AppSchema = new Schema({
  todos,
  lists,
  profiles,
});

export type Database = (typeof AppSchema)["types"];

export type TodoRecord = Database["todos"];
export type ProfileRecord = Database["profiles"];
export type ListRecord = Database["lists"];
