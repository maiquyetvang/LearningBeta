import { useQuery } from '@tanstack/react-query';
import { useSystem } from '~/lib/powersync';
import { LessonRecord } from '~/lib/powersync/app-schema';

export const USE_GET_LESSONS_BY_COURSE_QUERY_KEY = 'lessons-by-course';

export const useGetLessonsByCourse = (courseId?: string) => {
  const { db, supabase } = useSystem();

  return useQuery<LessonRecord[]>({
    queryKey: [USE_GET_LESSONS_BY_COURSE_QUERY_KEY, courseId],
    enabled: !!courseId,
    queryFn: async () => {
      if (!courseId) return [];
      const lessons = await db
        .selectFrom('lessons')
        .selectAll()
        .where('course_id', '=', courseId)
        .execute();

      if (!lessons || lessons.length === 0) {
        // Nếu local không có, lấy từ supabase
        const { data, error } = await supabase.client
          .from('lessons')
          .select('*')
          .eq('course_id', courseId);
        if (error) {
          console.error('Error fetching lessons', error);
          return [];
        }
        return data ?? [];
      }
      return lessons;
    },
  });
};
