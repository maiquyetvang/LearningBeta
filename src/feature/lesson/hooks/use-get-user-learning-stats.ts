import { useQuery } from '@tanstack/react-query';
import { useSystem } from '~/lib/powersync';
import { UserLearningStatsRecord } from '~/lib/powersync/app-schema';
import { useAuthStore } from '~/stores/auth.store';

export const USE_GET_USER_LEARNING_STATS_QUERY_KEY = 'user-learning-stats';

export const useGetUserLearningStats = () => {
  const { db, supabase } = useSystem();
  const { session } = useAuthStore();

  return useQuery<UserLearningStatsRecord | null>({
    queryKey: [USE_GET_USER_LEARNING_STATS_QUERY_KEY, session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      if (!session?.user?.id) return null;
      // Lấy từ local db trước
      const stats = await db
        .selectFrom('user_learning_stats')
        .selectAll()
        .where('user_id', '=', session.user.id)
        .executeTakeFirst();

      if (!stats) {
        // Nếu local không có, lấy từ supabase
        const { data, error } = await supabase.client
          .from('user_learning_stats')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        if (error) {
          console.error('Error fetching user_learning_stats', error);
          return null;
        }
        return data ?? null;
      }
      return stats;
    },
  });
};
