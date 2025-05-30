import { useQuery } from "@tanstack/react-query";
import { Course1Unit2, lessonGroups, levelTestLessons } from "~/data/lesson";
import { Course, Lesson, LessonGroup } from "~/types/lesson.type";
import { CompletedUnit, useLearningStore } from "../stores/learning.store";
import { LessonImages } from "assets";

async function fetchUnitById(id: string): Promise<LessonGroup> {
  const lessonInfo = lessonGroups.find((lesson) => lesson.id === id);
  if (!lessonInfo) {
    throw new Error("Lesson not found");
  }
  if (id === "level-test")
    return {
      image: LessonImages[2],
      ...lessonInfo,
      lessons: levelTestLessons,
      targets: [
        "You can hear and talk about family relationships.",
        "You can read and write articles introducing your family.",
      ],
      vocabulary: ["Family", "Job"],
      grammar: ["This", "This is not"],
    };
  return {
    image: LessonImages[2],
    ...lessonInfo,
    lessons: Course1Unit2,
    targets: [
      "You can hear and talk about family relationships.",
      "You can read and write articles introducing your family.",
    ],
    vocabulary: ["Family", "Job"],
    grammar: ["This", "This is not"],
  };
}
async function fetchCourseById(id: string): Promise<Course> {
  if (!id) {
    throw new Error("Course ID is required");
  }
  return {
    id: "course-1",
    title: "Korean for Beginners",
    description: "Learn Korean from scratch",
    lessonGroups: lessonGroups,
  };
}
async function fetchCompletedUnit(courseId?: string): Promise<CompletedUnit[]> {
  const { learnedLessons } = useLearningStore();
  if (!courseId) {
    return learnedLessons;
  }
  return learnedLessons.filter((lesson) => lesson.courseId === courseId);
}

export function useGetLessonGroup(id?: string) {
  return useQuery<LessonGroup>({
    queryKey: ["lesson-group", id],
    queryFn: () => fetchUnitById(id!),
    enabled: !!id,
  });
}
export function useGetCourse(courseId?: string) {
  return useQuery<Course>({
    queryKey: ["course", courseId],
    queryFn: () => fetchCourseById(courseId!),
    enabled: !!courseId,
  });
}
export function useGetCompletedUnit(courseId?: string) {
  return useQuery<CompletedUnit[]>({
    queryKey: ["completedUnits", courseId],
    queryFn: () => fetchCompletedUnit(courseId),
    enabled: true,
  });
}
