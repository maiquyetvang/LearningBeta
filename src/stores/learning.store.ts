import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProgressStep } from "../components/custom-ui/progress";
import { Course } from "../types/lesson.type";

export type CompletedUnit = {
  lessonId: string;
  courseId?: string;
  learnedAt: number;
  correctAnswers: number;
  totalQuestions: number;
  // duration: number;
};

type InProgressLesson = {
  lessonId: string;
  currentIndex: number;
  progress: ProgressStep[];
  totalLesson: number;
  reviewIndexes?: number[];
};

type LearningState = {
  learnedLessons: CompletedUnit[];
  currentLesson: string | null;
  currentCourse?: Course | null;
  totalLearningTime: number;
  streakDays: number;
  lastLearnedDate: string | null;
  inProgressLesson?: InProgressLesson | null;
  isAudioDisabled?: boolean;
  isSpeechDisabled?: boolean;
};

type LearningActions = {
  markLessonAsLearned: (
    lessonId: string,
    correctAnswers: number,
    totalQuestions: number,
    // duration: number,
    pathId?: string
  ) => void;
  setCurrentLesson: (lessonId: string) => void;
  setCurrentCourse: (courseId?: Course) => void;
  resetLearning: () => void;
  saveInProgressLesson: (data: InProgressLesson) => void;
  clearInProgressLesson: () => void;
  setAudioDisabled: (value: boolean) => void;
  setSpeechDisabled: (value: boolean) => void;
  addLearningTime: (duration: number) => void;
};

function getTodayString() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

export const useLearningStore = create<LearningState & LearningActions>()(
  persist(
    (set) => ({
      currentCourse: null,
      learnedLessons: [],
      currentLesson: null,
      totalLearningTime: 0,
      streakDays: 0,
      lastLearnedDate: null,
      inProgressLesson: null,
      isAudioDisabled: false,
      isSpeechDisabled: false,
      markLessonAsLearned: (
        lessonId,
        correctAnswers,
        totalQuestions,
        // duration,
        pathId
      ) =>
        set((state) => {
          const now = Date.now();
          const today = getTodayString();
          let newStreak = state.streakDays;
          if (state.lastLearnedDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().slice(0, 10);
            if (state.lastLearnedDate === yesterdayStr) {
              newStreak = state.streakDays + 1;
            } else {
              newStreak = 1;
            }
          }
          const existing = state.learnedLessons.find(
            (l) => l.lessonId === lessonId
          );
          if (existing) {
            return {
              learnedLessons: state.learnedLessons.map((l) =>
                l.lessonId === lessonId
                  ? {
                      ...l,
                      learnedAt: now,
                      correctAnswers,
                      totalQuestions,
                      // duration,
                      courseId: pathId,
                    }
                  : l
              ),
              // totalLearningTime: state.totalLearningTime + duration,
              streakDays: newStreak,
              lastLearnedDate: today,
            };
          }
          return {
            learnedLessons: [
              ...state.learnedLessons,
              {
                lessonId,
                courseId: pathId,
                learnedAt: now,
                correctAnswers,
                totalQuestions,
                // duration,
              },
            ],
            // totalLearningTime: state.totalLearningTime + duration,
            streakDays: newStreak,
            lastLearnedDate: today,
          };
        }),
      setCurrentLesson: (lessonId) =>
        set(() => ({
          currentLesson: lessonId,
        })),
      setCurrentCourse: (course) =>
        set(() => ({
          currentCourse: course,
        })),
      resetLearning: () =>
        set(() => ({
          learnedLessons: [],
          currentLesson: null,
          totalLearningTime: 0,
          streakDays: 0,
          lastLearnedDate: null,
        })),
      saveInProgressLesson: (data) =>
        set(() => ({
          inProgressLesson: data,
        })),
      clearInProgressLesson: () =>
        set(() => ({
          inProgressLesson: null,
        })),
      setAudioDisabled: (value) =>
        set(() => ({
          isAudioDisabled: value,
        })),
      setSpeechDisabled: (value) =>
        set(() => ({
          isSpeechDisabled: value,
        })),
      addLearningTime: (duration) =>
        set((state) => ({
          totalLearningTime: state.totalLearningTime + duration,
        })),
    }),
    {
      name: "learning-storage",
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);
