import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSystem } from '~/lib/powersync';
import { useAuthStore } from '~/stores/auth.store';
import {
  USE_GET_USER_LEARNING_STATS_QUERY_KEY,
  useGetUserLearningStats,
} from './use-get-user-learning-stats';

export const useAddLearningTime = () => {
  const { db } = useSystem();
  const { session } = useAuthStore();
  const { data: userLearningStats } = useGetUserLearningStats();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addTime: number) => {
      if (!session?.user?.id) throw new Error('No user on the session!');
      const prev = userLearningStats?.total_learning_time ?? 0;
      await db
        .updateTable('user_learning_stats')
        .set({
          total_learning_time: prev + addTime,
          updated_at: new Date().toISOString(),
        })
        .where('user_id', '=', session.user.id)
        .execute();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [USE_GET_USER_LEARNING_STATS_QUERY_KEY, session?.user?.id],
      });
    },
  });
};
