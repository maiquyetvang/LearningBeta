import { useGetCompletedLessons } from '~/feature/lesson/hooks/use-get-completed-lessons';
import { useGetLessonsByCourse } from '~/feature/lesson/hooks/use-get-lessons-by-course';
import { CourseRecord, LessonRecord } from '~/lib/powersync/app-schema';

export function useNextLesson(course?: CourseRecord | null) {
  const { data: completedUnit } = useGetCompletedLessons();
  const { data: courseLessons } = useGetLessonsByCourse(course?.id || '');

  const checkIsCompleted = (lessonId: string) =>
    completedUnit?.some((unit) => unit.lesson_id === lessonId);

  const lessonGroups = (courseLessons ?? [])
    .filter((lesson) => lesson.course_id === course?.id)
    .map((lesson) => ({
      ...lesson,
      isCompleted: checkIsCompleted(lesson.id),
    }));

  const lastCompletedIndex = lessonGroups.map((lesson) => lesson.isCompleted).lastIndexOf(true);

  const nextLesson = (lessonGroups[lastCompletedIndex + 1] ??
    lessonGroups.find((lesson) => !lesson.isCompleted)) as LessonRecord;

  const totalLessons = lessonGroups.length || 0;
  const progress =
    totalLessons > 0
      ? (lessonGroups.filter((lesson) => lesson.isCompleted).length / totalLessons) * 100
      : 0;
  const isAllCompleted = completedUnit?.length === totalLessons && totalLessons > 0;

  return {
    checkIsCompleted,
    lessonGroups,
    lastCompletedIndex,
    nextLesson,
    totalLessons,
    progress,
    isAllCompleted,
    isLevelTest: false, // Không phải level test
  };
}
