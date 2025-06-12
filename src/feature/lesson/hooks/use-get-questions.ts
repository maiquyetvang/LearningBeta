import { useQuery } from '@tanstack/react-query';
import { useSystem } from '~/lib/powersync';
import { QuestionRecord } from '~/lib/powersync/app-schema';
import type { LessonValue } from '~/types/lesson.type';

export type QuestionWithParsedContent = Omit<QuestionRecord, 'content'> & { value: LessonValue };

export const USE_GET_QUESTIONS_QUERY_KEY = 'questions';

export const useGetQuestions = (lessonId?: string) => {
  const { db, supabase } = useSystem();

  return useQuery<QuestionWithParsedContent[]>({
    queryKey: [USE_GET_QUESTIONS_QUERY_KEY, lessonId],
    enabled: !!lessonId,
    queryFn: async () => {
      if (!lessonId) return [];
      // Lấy từ local db trước
      const questions = await db
        .selectFrom('questions')
        .selectAll()
        .where('lesson_id', '=', lessonId)
        .orderBy('order_index', 'asc')
        .execute();

      const parseContent = (q: QuestionRecord): QuestionWithParsedContent => ({
        ...q,
        value: typeof q.content === 'string' ? JSON.parse(q.content) : q.content,
      });

      if (!questions || questions.length === 0) {
        // Nếu local không có, lấy từ supabase
        const { data, error } = await supabase.client
          .from('questions')
          .select('*')
          .eq('lesson_id', lessonId)
          .order('order_index', { ascending: true });
        if (error) {
          console.error('Error fetching questions', error);
          return [];
        }
        return (data ?? []).map(parseContent);
      }
      return questions.map(parseContent);
    },
  });
};
