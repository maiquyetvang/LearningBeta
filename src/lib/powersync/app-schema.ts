import { column, Schema, Table } from '@powersync/react-native';

export const QUESTION_TYPES = [
  'voice',
  'select',
  'sentence',
  'single-choose',
  'single-image-choose',
  'listening',
  'write-only-word',
  'write-word',
  'mapping',
] as const;

export const ACHIEVEMENT_TYPES = [
  'progress',
  'streak',
  'mastery',
  'time',
  'social',
  'special',
] as const;

export const BADGE_TYPES = ['bronze', 'silver', 'gold', 'platinum'] as const;

const profiles = new Table(
  {
    user_id: column.text,
    username: column.text,
    full_name: column.text,
    avatar_url: column.text,
    has_completed_survey: column.integer,
    currency_code: column.text,
    learning_level: column.text,
    learning_purpose: column.text,
    daily_duration: column.text,
    native_language: column.text,
    target_language: column.text,
    ui_language: column.text,
    created_at: column.text,
    updated_at: column.text,
  },
  {
    indexes: {
      id: ['id'],
      user_id: ['user_id'],
    },
  },
);

const user_learning_stats = new Table(
  {
    user_id: column.text,
    total_learning_time: column.integer,
    streak_days: column.integer,
    last_learned_date: column.text,
    updated_at: column.text,
    current_course_id: column.text,
    current_lesson_id: column.text,
  },
  {
    indexes: {
      user_id: ['user_id'],
    },
  },
);

const courses = new Table(
  {
    title: column.text,
    description: column.text,
    cover_image_url: column.text,
    difficulty_level: column.text,
    total_lessons: column.integer,
    is_featured: column.integer,
    is_premium: column.integer,
    source_language: column.text,
    target_language: column.text,
    created_at: column.text,
    updated_at: column.text,
  },
  {
    indexes: {
      id: ['id'],
    },
  },
);

const lessons = new Table(
  {
    course_id: column.text,
    title: column.text,
    description: column.text,
    image_url: column.text,
    order_index: column.integer,
    total_question: column.integer,
    targets: column.text,
    vocabulary: column.text,
    grammar: column.text,
    is_level_test: column.integer,
    created_at: column.text,
    updated_at: column.text,
  },
  {
    indexes: {
      id: ['id'],
      course_id: ['course_id'],
    },
  },
);

const questions = new Table(
  {
    lesson_id: column.text,
    type: column.text,
    order_index: column.integer,
    content: column.text,
    created_at: column.text,
    updated_at: column.text,
  },
  {
    indexes: {
      id: ['id'],
      lesson_id: ['lesson_id'],
    },
  },
);

const completed_lessons = new Table(
  {
    user_id: column.text,
    lesson_id: column.text,
    course_id: column.text,
    completed_at: column.text,
    time_spent: column.integer,
  },
  {
    indexes: {
      id: ['id'],
      user_id: ['user_id'],
      lesson_id: ['lesson_id'],
      course_id: ['course_id'],
    },
  },
);

const achievements = new Table(
  {
    name: column.text,
    description: column.text,
    icon_url: column.text,
    category: column.text,
    required_value: column.integer,
    is_hidden: column.integer,
    badge_type: column.text,
    created_at: column.text,
    updated_at: column.text,
  },
  {
    indexes: {
      id: ['id'],
    },
  },
);

const user_achievements = new Table(
  {
    user_id: column.text,
    achievement_id: column.text,
    current_value: column.integer,
    is_completed: column.integer,
    completed_at: column.text,
    created_at: column.text,
    updated_at: column.text,
  },
  {
    indexes: {
      id: ['id'],
      user_id: ['user_id'],
      achievement_id: ['achievement_id'],
    },
  },
);

export const AppSchema = new Schema({
  profiles,
  user_learning_stats,
  courses,
  lessons,
  questions,
  completed_lessons,
  achievements,
  user_achievements,
});

export type Database = (typeof AppSchema)['types'];
export type ProfileRecord = Database['profiles'];
export type UserLearningStatsRecord = Database['user_learning_stats'];
export type CourseRecord = Database['courses'];
export type LessonRecord = Database['lessons'];
export type QuestionRecord = Database['questions'];
export type CompletedLessonRecord = Database['completed_lessons'];
export type AchievementRecord = Database['achievements'];
export type UserAchievementRecord = Database['user_achievements'];
