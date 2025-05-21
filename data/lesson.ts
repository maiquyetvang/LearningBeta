import { ELessonType, Lesson } from "~/types/lesson.type";

export const sampleLesson: Lesson[] = [
  {
    type: ELessonType.SingleChoose,
    value: {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Apple_Computer_Logo_rainbow.svg/250px-Apple_Computer_Logo_rainbow.svg.png",
      selectors: ["바나나", "우유", "사과", "밥"],
      audioLanguage: "ko",
      answer: "우유",
    },
  },
  {
    type: ELessonType.SingleChoose,
    value: {
      question: "저는 학생이에요.",
      selectors: [
        "I'm a teacher",
        "I'm a student",
        "I'm a doctor",
        "I'm Korean",
      ],
      answer: "I'm a student",
    },
  },
  {
    type: ELessonType.Listening,
    value: {
      // question: "___ are the gifts.",
      selectors: [
        "Hello, nice to meet you",
        "My name is Minho",
        "Goodbye, see you",
        "Thanks a lot",
      ],
      audioLanguage: "en",
      answer: "Hello, nice to meet you",
    },
  },
  {
    type: ELessonType.Voice,
    value: {
      question: "안녕하세요",
      answer: "안녕하세요",
      audioLanguage: "ko",
    },
  },
  {
    type: ELessonType.WriteOnlyWord,
    value: {
      question: "학교",
      answer: "학교",
      audioLanguage: "ko",
    },
  },
  {
    type: ELessonType.WriteWord,
    value: {
      hint: "I eat rice",
      question: "저는 ___ 먹어요",
      answer: "밥",
    },
  },
  {
    type: ELessonType.Sentence,
    value: {
      question: "I am a student.",
      selectors: [
        "저는",
        "학생입니다",
        "사과",
        "책",
        "사람",
        "이다",
        "학생",
        "선생님",
      ],
      answers: ["저는", "학생입니다"],
      audioLanguage: "ko",
    },
  },
  // {
  //   type: ELessonType.Sentence,
  //   value: {
  //     question: "이 사람은 선생님입니다.",
  //     selectors: ["is", "This", "apple", "student", "person", "a", "teacher"],
  //     answers: ["This", "person", "is", "a", "teacher"],
  //   },
  // },

  {
    type: ELessonType.Mapping,
    value: {
      selectors: ["Apple", "Banana", "Orange", "Grapes"],
      answers: ["사과", "바나나", "오렌지", "포도"],
      audioLanguage: "ko",
    },
  },
].reverse();
