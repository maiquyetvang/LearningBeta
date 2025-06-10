import { useQuery } from "@powersync/react-native";
import { Session } from "@supabase/supabase-js";
import React, { useState } from "react";
import { set } from "react-hook-form";
import { SafeAreaView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PullToRefreshWrapper from "~/components/common/PullToRefreshWrapper";
import { AnimatedButton } from "~/components/custom-ui/animate-button";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import {
  ListRecord,
  LISTS_TABLE,
  TodoRecord,
  TODOS_TABLE,
} from "~/lib/powersync/app-schema";
import { useSystem } from "~/lib/powersync/system";

const Todos = () => {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);
  const { supabase, db } = useSystem();
  const system = useSystem();
  const [newListName, setNewListName] = useState<string>();
  const [todos, setTodos] = useState<ListRecord[] | undefined>();
  const [session, setSession] = useState<Session | null>();
  const [userID, setUserID] = useState<string | null>();
  const {
    data: listRecords,
    isLoading,
    refresh,
  } = useQuery<ListRecord & { total_tasks: number; completed_tasks: number }>(`
      SELECT
        ${LISTS_TABLE}.*, COUNT(${TODOS_TABLE}.id) AS total_tasks, SUM(CASE WHEN ${TODOS_TABLE}.completed = true THEN 1 ELSE 0 END) as completed_tasks
      FROM
        ${LISTS_TABLE}
      LEFT JOIN ${TODOS_TABLE}
        ON  ${LISTS_TABLE}.id = ${TODOS_TABLE}.list_id
      GROUP BY
        ${LISTS_TABLE}.id;
      `);
  const createNewList = async (name: string) => {
    const userID = await supabase.userId();
    if (!userID) {
      throw new Error("User ID is not available");
    }

    const res = await system.powersync.execute(
      `INSERT INTO ${LISTS_TABLE} (id, created_at, name, owner_id) VALUES (uuid(), datetime(), ?, ?) RETURNING *`,
      [name, userID]
    );

    const resultRecord = res.rows?.item(0);
    if (!resultRecord) {
      throw new Error("Could not create list");
    }
  };
  const handleLoadTodos = async () => {
    const userID = await supabase.userId();
    setUserID(userID);
    // const result = await db?.selectFrom(TODOS_TABLE).selectAll().execute();
    // console.log({ result });
  };
  const handleLoadSession = async () => {
    const userID = await supabase.userId();
    setUserID(userID);
    // const { data: session } = await supabaseConnector.client.auth.getSession();
    // setSession(session.session);
    // console.log("Session:", session);
  };
  const deleteList = async (id: string) => {
    await system.powersync.writeTransaction(async (tx) => {
      // Delete associated todos
      await tx.execute(`DELETE FROM ${TODOS_TABLE} WHERE list_id = ?`, [id]);
      // Delete list record
      await tx.execute(`DELETE FROM ${LISTS_TABLE} WHERE id = ?`, [id]);
    });
  };
  const clearAllData = async () => {
    await system.powersync.writeTransaction(async (tx) => {
      await tx.execute(`DELETE FROM ${TODOS_TABLE}`);
      await tx.execute(`DELETE FROM ${LISTS_TABLE}`);
    });
  };
  return (
    <SafeAreaView
      className='flex-1 bg-background'
      style={{ paddingTop: insets.top }}
    >
      <PullToRefreshWrapper refreshing={refreshing} onRefresh={onRefresh}>
        <View className='p-5 gap-5 flex-1 '>
          <View className='flex-1 mb-auto gap-2'>
            {/* <Text className='text-lg font-bold'>
              todos: {todos ? todos.length : "undefine"}
              {"\n"}
              normalSQL: {todos ? todos.length : "undefine"}
              {"\n"}
              {JSON.stringify(todos)}
              {JSON.stringify(listRecords, null, 2)}
            </Text> */}
            {listRecords?.map((todo) => (
              <View
                key={todo.id}
                className='p-4 flex-row w-full bg-primary-50 dark:bg-primary-900 rounded-lg items-center justify-between gap-4'
              >
                <View>
                  <Text className='text-lg font-bold'>{todo.name}</Text>
                  <Text className='text-lg font-bold'>{todo.total_tasks}</Text>
                  <Text className='text-lg font-bold'>{todo.created_at}</Text>
                </View>
                <AnimatedButton onPress={() => deleteList(todo.id)}>
                  Xoá
                </AnimatedButton>
              </View>
            ))}
          </View>
          <Input
            value={newListName}
            onChangeText={setNewListName}
            // onSubmitEditing={() => {
            //   if (!!newListName) createNewList(newListName);
            // }}
          />
          {/* <AnimatedButton onPress={handleLoadTodos}>Load Todo</AnimatedButton> */}
          <AnimatedButton onPress={handleLoadSession}>
            Load section
          </AnimatedButton>
          <AnimatedButton
            onPress={() => {
              if (!!newListName) createNewList(newListName);
              setNewListName("");
            }}
          >
            Thêm
          </AnimatedButton>
          <AnimatedButton onPress={clearAllData}>
            Xoá toàn bộ dữ liệu local
          </AnimatedButton>
          <Text className='text-xs'>{JSON.stringify({ userID }, null, 4)}</Text>
        </View>
      </PullToRefreshWrapper>
    </SafeAreaView>
  );
};

export default Todos;
