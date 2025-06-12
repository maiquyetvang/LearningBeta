import { useQuery } from '@tanstack/react-query';
import { useSystem } from '~/lib/powersync';
import { CompletedLessonRecord } from '~/lib/powersync/app-schema';
import { useAuthStore } from '~/stores/auth.store';

export const USE_GET_COMPLETED_LESSONS_QUERY_KEY = 'completed-lessons';

export const useGetCompletedLessons = (courseId?: string) => {
  const { db, supabase } = useSystem();
  const { session } = useAuthStore();

  return useQuery<CompletedLessonRecord[] | null>({
    queryKey: [USE_GET_COMPLETED_LESSONS_QUERY_KEY, session?.user?.id, courseId],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      if (!session?.user?.id) return [];
      let query = db
        .selectFrom('completed_lessons')
        .selectAll()
        .where('user_id', '=', session.user.id);
      if (courseId) {
        query = query.where('course_id', '=', courseId);
      }
      const completed = await query.execute();

      if (!completed || completed.length === 0) {
        // Nếu local không có, lấy từ supabase
        let supaQuery = supabase.client
          .from('completed_lessons')
          .select('*')
          .eq('user_id', session.user.id);
        if (courseId) {
          supaQuery = supaQuery.eq('course_id', courseId);
        }
        const { data, error } = await supaQuery;
        if (error) {
          console.error('Error fetching completed lessons', error);
          return [];
        }
        return data ?? [];
      }
      return completed;
    },
  });
};
