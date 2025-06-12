import { useQuery } from '@tanstack/react-query';
import { useSystem } from '~/lib/powersync';
import { CourseRecord } from '~/lib/powersync/app-schema';

export const USE_GET_COURSES_QUERY_KEY = 'courses';

export function useGetCourses(): {
  data: CourseRecord[] | undefined;
  isLoading: boolean;
  error: unknown;
};
export function useGetCourses(courseId: string): {
  data: CourseRecord | null | undefined;
  isLoading: boolean;
  error: unknown;
};
export function useGetCourses(courseId?: string) {
  const { db, supabase } = useSystem();

  return useQuery({
    queryKey: [USE_GET_COURSES_QUERY_KEY, courseId],
    queryFn: async () => {
      if (courseId) {
        // Lấy 1 course theo id
        const course = await db
          .selectFrom('courses')
          .selectAll()
          .where('id', '=', courseId)
          .executeTakeFirst();
        if (!course) {
          const { data, error } = await supabase.client
            .from('courses')
            .select('*')
            .eq('id', courseId)
            .single();
          if (error) {
            console.error('Error fetching course', error);
            return null;
          }
          return data ?? null;
        }
        return course;
      } else {
        // Lấy tất cả course
        const courses = await db.selectFrom('courses').selectAll().execute();
        if (!courses || courses.length === 0) {
          const { data, error } = await supabase.client.from('courses').select('*');
          if (error) {
            console.error('Error fetching courses', error);
            return [];
          }
          return data ?? [];
        }
        return courses;
      }
    },
  });
}
