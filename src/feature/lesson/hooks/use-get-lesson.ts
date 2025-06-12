import { useQuery } from '@tanstack/react-query';
import { useSystem } from '~/lib/powersync';
import { LessonRecord } from '~/lib/powersync/app-schema';

export const USE_GET_LESSON_QUERY_KEY = 'lesson';

export type LessonWithParsedContent = Omit<LessonRecord, 'targets' | 'vocabulary' | 'grammar'> & {
  targets: string[];
  vocabulary: string[];
  grammar: string[];
};

const parseStringArray = (value: any): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const arr = JSON.parse(value);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
};

export const useGetLesson = ({
  id,
  levelTest,
  courseId,
}: {
  id?: string;
  levelTest?: boolean;
  courseId?: string;
}) => {
  const { db, supabase } = useSystem();

  const queryKey = levelTest
    ? [USE_GET_LESSON_QUERY_KEY, 'levelTest', courseId]
    : [USE_GET_LESSON_QUERY_KEY, id];

  return useQuery<LessonWithParsedContent | null>({
    queryKey,
    enabled: !!id || !!levelTest,
    queryFn: async () => {
      const parseLesson = (raw: any): LessonWithParsedContent => ({
        ...raw,
        targets: parseStringArray(raw.targets),
        vocabulary: parseStringArray(raw.vocabulary),
        grammar: parseStringArray(raw.grammar),
      });

      if (levelTest) {
        let query = db.selectFrom('lessons').selectAll().where('is_level_test', '=', 1);
        if (courseId) query = query.where('course_id', '=', courseId);
        const lesson = await query.orderBy('created_at', 'desc').executeTakeFirst();

        if (lesson) return parseLesson(lesson);

        let supabaseQuery = supabase.client
          .from('lessons')
          .select('*')
          .eq('is_level_test', true)
          .order('created_at', { ascending: false })
          .limit(1);
        if (courseId) supabaseQuery = supabaseQuery.eq('course_id', courseId);

        const { data, error } = await supabaseQuery.single();
        if (error || !data) {
          console.error('Error fetching level test lesson', error);
          return null;
        }
        return parseLesson(data);
      }

      if (!id) return null;
      const lesson = await db
        .selectFrom('lessons')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst();

      if (lesson) return parseLesson(lesson);

      const { data, error } = await supabase.client
        .from('lessons')
        .select('*')
        .eq('id', id)
        .single();
      if (error || !data) {
        console.error('Error fetching lesson', error);
        return null;
      }
      return parseLesson(data);
    },
  });
};
