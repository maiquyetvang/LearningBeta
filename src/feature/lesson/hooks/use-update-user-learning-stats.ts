import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSystem } from '~/lib/powersync';
import { useAuthStore } from '~/stores/auth.store';
import { USE_GET_USER_LEARNING_STATS_QUERY_KEY } from './use-get-user-learning-stats';
import { UserLearningStatsRecord } from '~/lib/powersync/app-schema';

type UpdateUserLearningStatsInput = Partial<
  Omit<
    UserLearningStatsRecord,
    'user_id' | 'id' | 'streak_days' | 'last_learned_date' | 'updated_at'
  >
>;

export const useUpdateUserLearningStats = () => {
  const { db } = useSystem();
  const { session } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fields: UpdateUserLearningStatsInput) => {
      if (!session?.user?.id) throw new Error('No user on the session!');
      if (!fields || Object.keys(fields).length === 0) return;

      await db
        .updateTable('user_learning_stats')
        .set({
          ...fields,
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
