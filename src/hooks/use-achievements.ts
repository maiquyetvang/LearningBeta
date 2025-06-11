import { useQuery } from '@tanstack/react-query';
import { useSystem } from '~/lib/powersync';

export const USE_GET_ACHIEVEMENTS_QUERY_KEY = 'achievements';

export const useGetAchievements = () => {
  const { db, supabase } = useSystem();

  const { data, ...rest } = useQuery({
    queryKey: [USE_GET_ACHIEVEMENTS_QUERY_KEY],
    queryFn: async () => {
      // Lấy từ local db trước
      const achievements = await db.selectFrom('achievements').selectAll().execute();

      if (!achievements || achievements.length === 0) {
        // Nếu local không có, lấy từ supabase
        const { data, error } = await supabase.client.from('achievements').select('*');
        if (error) {
          console.error('Error fetching achievements', error);
          return [];
        }
        return data ?? [];
      }
      return achievements;
    },
  });

  return { data, ...rest };
};
