import { useQuery } from "@tanstack/react-query";
import { Badge, BADGES } from "../app/(protected)/(_tabs)/(achievements)";

async function fetchBadgeById(id: string): Promise<Badge> {
  // const res = await fetch(`https://your-api/lessons/${id}`);
  // if (!res.ok) throw new Error("Failed to fetch lesson");
  // Giả sử sampleLesson là một mảng, lấy phần tử đầu tiên
  const badge = BADGES.find((badge) => badge.id === id);
  if (!badge) {
    throw new Error("Badge not found");
  }
  return badge;
}

export function useGetBadgeById(id?: string) {
  return useQuery<Badge>({
    queryKey: ["achievement", id],
    queryFn: () => fetchBadgeById(id!),
    enabled: !!id,
  });
}
