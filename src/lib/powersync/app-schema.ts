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

// TABLES

const profiles = new Table(
  {
    id: column.text, // UUID
    user_id: column.text, // UUID
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
    user_id: column.text, // UUID
    total_learning_time: column.integer,
    streak_days: column.integer,
    last_learned_date: column.text,
    updated_at: column.text,
  },
  {
    indexes: {
      user_id: ['user_id'],
    },
  },
);

const courses = new Table(
  {
    id: column.text, // UUID
    title: column.text,
    description: column.text,
    cover_image_url: column.text,
    difficulty_level: column.text,
    total_lessons: column.integer,
    is_featured: column.integer, // boolean as integer (0/1)
    is_premium: column.integer, // boolean as integer (0/1)
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
    id: column.text, // UUID
    course_id: column.text, // UUID
    title: column.text,
    description: column.text,
    image_url: column.text,
    order_index: column.integer,
    total_question: column.integer,
    targets: column.text, // JSONB as string
    vocabulary: column.text, // JSONB as string
    grammar: column.text, // JSONB as string
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
    id: column.text, // UUID
    lesson_id: column.text, // UUID
    type: column.text, // ENUM as string
    order_index: column.integer,
    content: column.text, // JSONB as string
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
    id: column.text, // UUID
    user_id: column.text, // UUID
    lesson_id: column.text, // UUID
    course_id: column.text, // UUID
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
    id: column.text, // UUID
    name: column.text,
    description: column.text,
    icon_url: column.text,
    category: column.text, // ENUM as string
    required_value: column.integer,
    is_hidden: column.integer, // boolean as integer (0/1)
    badge_type: column.text, // ENUM as string
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
    id: column.text, // UUID
    user_id: column.text, // UUID
    achievement_id: column.text, // UUID
    current_value: column.integer,
    is_completed: column.integer, // boolean as integer (0/1)
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
