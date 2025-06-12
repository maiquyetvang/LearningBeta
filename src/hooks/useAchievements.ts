import { AchievementImages } from 'assets';
import { useMemo } from 'react';
import { useGetCompletedLessons } from '~/feature/lesson/hooks/use-get-completed-lessons';
import { useGetLesson } from '~/feature/lesson/hooks/use-get-lesson';
import { useGetUserLearningStats } from '~/feature/lesson/hooks/use-get-user-learning-stats';

export type Badge = {
  id: string;
  name: string;
  desc: string;
  icon: any;
  progress: number;
  total: number;
};

const BADGES: Badge[] = [
  {
    id: '1',
    name: 'Challenger',
    desc: 'Take your first test',
    icon: AchievementImages['1'],
    progress: 0,
    total: 1,
  },
  {
    id: '2',
    name: 'My First Book',
    desc: 'Complete the first lesson',
    icon: AchievementImages['2'],
    progress: 0,
    total: 1,
  },
  {
    id: '3',
    name: 'Working Hard',
    desc: 'Complete 7 days chain of learning',
    icon: AchievementImages['3'],
    progress: 0,
    total: 7,
  },
];

export function useAchievements() {
  const { data: userLearningStats } = useGetUserLearningStats();
  const { data: learnedLessons } = useGetCompletedLessons();
  const { data: levelTestData } = useGetLesson({ levelTest: true });
  const levelTestId = levelTestData?.id || undefined;
  const streakDays = userLearningStats?.streak_days || 0;

  const { badges, total, done, percent } = useMemo(() => {
    const BADGESData: Badge[] = BADGES.map((badge) => {
      switch (badge.id) {
        case '1':
          return {
            ...badge,
            progress:
              !!learnedLessons && learnedLessons.find((l) => l.lesson_id === levelTestId) ? 1 : 0,
          };
        case '2':
          return {
            ...badge,
            progress:
              learnedLessons && learnedLessons.filter((l) => l.lesson_id !== levelTestId).length > 0
                ? 1
                : 0,
          };
        case '3':
          return {
            ...badge,
            progress: Math.min(streakDays, badge.total),
          };
        default:
          return badge;
      }
    });

    const total = BADGESData.length;
    const done = BADGESData.filter((b) => b.progress >= b.total).length;
    const percent = Math.round((done / total) * 100);

    return { badges: BADGESData, total, done, percent };
  }, [learnedLessons, levelTestId, streakDays]);

  return {
    badges,
    percent,
    total,
    done,
  };
}
