import { useLearningStore } from '~/stores/learning.store';
import { AchievementImages } from 'assets';

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
  const { learnedLessons, streakDays } = useLearningStore();

  const BADGESData: Badge[] = BADGES.map((badge) => {
    switch (badge.id) {
      case '1':
        return {
          ...badge,
          progress: learnedLessons.find((l) => l.lessonId === 'level-test') ? 1 : 0,
        };
      case '2':
        return {
          ...badge,
          progress: learnedLessons.filter((l) => l.lessonId !== 'level-test').length > 0 ? 1 : 0,
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

  return {
    badges: BADGESData,
    percent,
    total,
    done,
  };
}
