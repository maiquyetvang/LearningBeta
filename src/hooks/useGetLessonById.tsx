import { useQuery } from "@tanstack/react-query";
import { sampleLesson } from "~/src/data/lesson";
import { Lesson } from "~/src/types/lesson.type";

async function fetchLessonById(id: string): Promise<Lesson[]> {
  // const res = await fetch(`https://your-api/lessons/${id}`);
  // if (!res.ok) throw new Error("Failed to fetch lesson");
  // Giả sử sampleLesson là một mảng, lấy phần tử đầu tiên
  return sampleLesson;
  // return res.json();
}

export function useGetLessonById(id?: string) {
  return useQuery<Lesson[]>({
    queryKey: ["lesson", id],
    queryFn: () => fetchLessonById(id!),
    enabled: !!id,
  });
}
