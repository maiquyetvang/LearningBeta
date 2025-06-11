import { useLearningStore } from '~/stores/learning.store';
import { Course, LessonGroup } from '~/types/lesson.type';
import { useGetLessonGroup } from './useGetLessonById';

export function useNextLesson(course?: Course) {
  const { learnedLessons: completedUnit } = useLearningStore();
  const { data: levelTestLesson } = useGetLessonGroup('level-test');

  const checkIsCompleted = (lessonId: string) =>
    completedUnit?.some((unit) => unit.lessonId === lessonId);

  // const hasCompletedLevelTest = checkIsCompleted("level-test");

  const lessonGroups = (course?.lessonGroups ?? [])
    .filter((lesson) => lesson.courseId === course?.id)
    .map((lesson) => ({
      ...lesson,
      isCompleted: checkIsCompleted(lesson.id),
    }));

  const lastCompletedIndex = lessonGroups.map((lesson) => lesson.isCompleted).lastIndexOf(true);

  const nextLesson = (lessonGroups[lastCompletedIndex + 1] ??
    lessonGroups.find((lesson) => !lesson.isCompleted)) as LessonGroup;

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
