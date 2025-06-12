import { useMutation } from '@tanstack/react-query';
import { useSystem } from '~/lib/powersync';
import { useAuthStore } from '~/stores/auth.store';

interface CompleteLessonInput {
  lesson_id: string;
  course_id: string;
  time_spent?: number;
}

export const useMarkCompleteLesson = () => {
  const { supabase } = useSystem();
  const { session } = useAuthStore();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async ({ lesson_id, course_id, time_spent }: CompleteLessonInput) => {
      const { error } = await supabase.client.from('completed_lessons').insert([
        {
          user_id: userId,
          lesson_id,
          course_id,
          time_spent: time_spent ?? 0,
        },
      ]);
      if (error) throw error;
    },
  });
};
