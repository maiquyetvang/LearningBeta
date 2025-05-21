export enum ELessonType {
  Voice = "voice",
  Select = "select",
  Sentence = "sentence",
  SingleChoose = "single-choose",
  Listening = "listening",
  WriteOnlyWord = "write-only-word",
  WriteWord = "write-word",
  Mapping = "mapping",
}
export interface LessonValue {
  question?: string;
  hint?: string;
  image?: string;
  answer?: string;
  answers?: string[];
  selectors?: string[];
  audioLanguage?: "en" | "ko" | string;
}
export interface Lesson {
  type: ELessonType;
  value: LessonValue;
}
