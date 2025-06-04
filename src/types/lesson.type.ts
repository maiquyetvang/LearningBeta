import { ImageSourcePropType } from "react-native";

export enum ELessonType {
  Voice = "voice",
  Select = "select",
  Sentence = "sentence",
  SingleChoose = "single-choose",
  SingleImageChoose = "single-image-choose",
  Listening = "listening",
  WriteOnlyWord = "write-only-word",
  WriteWord = "write-word",
  Mapping = "mapping",
}
export interface LessonValue {
  question?: string;
  hint?: string;
  image?: ImageSourcePropType | string;
  answer?: string;
  answers?: string[];
  selectors?: string[];
  imageSelectors?: { image: ImageSourcePropType; label: string }[];
  audioLanguage?: "en" | "ko" | string;
  questionLanguage?: "en" | "ko" | string;
}
export interface Lesson {
  type: ELessonType;
  value: LessonValue;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  lessonGroups: LessonGroup[];
}

export interface LessonGroup {
  id: string;
  title: string;
  description: string;
  courseId: string;
  image?: ImageSourcePropType;
  lessons?: Lesson[];
  targets?: string[];
  vocabulary?: string[];
  grammar?: string[];
  isCompleted?: boolean;
}
