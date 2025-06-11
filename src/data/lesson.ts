import { LessonImages } from 'assets';
import { ELessonType, Lesson, LessonGroup } from '~/types/lesson.type';

export const lessonGroups: LessonGroup[] = [
  {
    id: 'level-test',
    title: 'Placement Test',
    description: 'Test your Korean level',
    courseId: 'course-0',
    image: LessonImages[1],
  },
  {
    id: 'course-1-1',
    title: '회사원이 아니에요 1',
    description: "I'm not a company employee",
    courseId: 'course-1',
    image: LessonImages[1],
  },
  {
    id: 'course-1-2',
    title: '회사원이 아니에요 2',
    description: "I'm not a company employee",
    courseId: 'course-1',
    image: LessonImages[2],
  },
  {
    id: 'course-1-3',
    title: '회사원이 아니에요 3',
    description: "I'm not a company employee",
    courseId: 'course-1',
    image: LessonImages[3],
  },
  {
    id: 'course-1-4',
    title: '회사원이 아니에요 4',
    description: "I'm not a company employee",
    courseId: 'course-1',
    image: LessonImages[4],
  },
  {
    id: 'course-1-5',
    title: '회사원이 아니에요 5',
    description: "I'm not a company employee",
    courseId: 'course-1',
    image: LessonImages[5],
  },
];

export const levelTestLessons: Lesson[] = [
  {
    type: ELessonType.SingleChoose,
    value: {
      image: LessonImages.Apple,
      selectors: ["바나나", "우유", "사과", "밥"],
      questionLanguage: "ko",
      answer: "우유",
    },
  },
  {
    type: ELessonType.SingleChoose,
    value: {
      question: '저는 학생이에요.',
      selectors: ["I'm a teacher", "I'm a student", "I'm a doctor", "I'm Korean"],
      answer: "I'm a student",
    },
  },
  {
    type: ELessonType.Listening,
    value: {
      selectors: ["불", "물", "문", "몰"],
      questionLanguage: "ko",
      answer: "물",
    },
  },
  {
    type: ELessonType.Listening,
    value: {
      question: "안녕하세요, 만나서 반갑습니다.",
      selectorLanguage: "ko",
      selectors: [
        'Hello, nice to meet you',
        'My name is Minho',
        'Goodbye, see you',
        'Thanks a lot',
      ],
      answer: 'Hello, nice to meet you',
    },
  },
  {
    type: ELessonType.Speaking,
    value: {
      question: "안녕하세요",
      answer: "안녕하세요",
      questionLanguage: "ko",
    },
  },
  {
    type: ELessonType.Speaking,
    value: {
      question: "저는 수진입니다",
      answer: "저는 수진입니다",
      questionLanguage: "ko",
    },
  },
  {
    type: ELessonType.WriteOnlyWord,
    value: {
      question: "학교",
      answer: "학교",
      questionLanguage: "ko",
    },
  },
  {
    type: ELessonType.WriteWord,
    value: {
      hint: 'I eat rice',
      question: '저는 ___ 먹어요',
      answer: '밥',
    },
  },
  {
    type: ELessonType.Sentence,
    value: {
      question: "이 사람은 선생님입니다.",
      selectors: [
        "is",
        "This",
        "a",
        "student",
        "teacher",
        "the",
        "person",
        "Apple",
      ],
      answers: ["This", "person", "is", "the", "teacher"],
      questionLanguage: "en",
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
      questionLanguage: "ko",
    },
  },

  {
    type: ELessonType.Mapping,
    value: {
      selectors: ["밥", "선생님", "학생", "물"],
      answers: ["Rice", "Teacher", "Student", "Water"],
      selectorLanguage: "ko",
      questionLanguage: "en",
    },
  },
  {
    type: ELessonType.Mapping,
    value: {
      selectors: ["Hello", "School", "Book", "Apple"],
      answers: ["안녕하세요", "학교", "책", "사과"],
      selectorLanguage: "en",
      questionLanguage: "ko",
    },
  },
];
// .slice(0, 2)
// .reverse();
// .slice(0, 5);

export const course1Unit1: Lesson[] = [
  {
    type: ELessonType.SingleImageChoose,
    value: {
      question: '아버지',
      imageSelectors: [
        { image: LessonImages.FamilyDad, label: 'Father' },
        { image: LessonImages.FamilyMom, label: 'Mother' },
        {
          image: LessonImages.FamilyYoungBrother,
          label: 'Young Brother/Sister',
        },
        { image: LessonImages.FamilyBrother, label: 'Brother' },
      ],
      answer: "Father",
      questionLanguage: "en",
    },
  },
  {
    type: ELessonType.WriteWord,
    value: {
      hint: 'I am American.',
      question: '___ 사람이에요.',
      answer: '미국',
    },
  },
];

export const Course1Unit2: Lesson[] = [
  {
    type: ELessonType.Listening,
    value: {
      question: "안녕하세요, 만나서 반갑습니다.",
      questionLanguage: "ko",
      selectorLanguage: "en",
      selectors: [
        "Hello, nice to meet you",
        "My name is Minho",
        "Goodbye, see you",
        "Thanks a lot",
      ],
      answer: "Hello, nice to meet you",
    },
  },
  {
    type: ELessonType.SingleImageChoose,
    value: {
      question: '아버지',
      imageSelectors: [
        { image: LessonImages.FamilyDad, label: 'Father' },
        { image: LessonImages.FamilyMom, label: 'Mother' },
        {
          image: LessonImages.FamilyYoungBrother,
          label: 'Young Brother/Sister',
        },
        { image: LessonImages.FamilyBrother, label: 'Brother' },
      ],
      answer: "Father",
      questionLanguage: "ko",
      selectorLanguage: "en",
    },
  },
  {
    type: ELessonType.SingleChoose,
    value: {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_South_Korea.svg/1200px-Flag_of_South_Korea.svg.png",
      selectors: ["미국", "한국", "사과"],
      selectorLanguage: "ko",
      answer: "한국",
    },
  },
  {
    type: ELessonType.SingleChoose,
    value: {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/2560px-Flag_of_the_United_States.svg.png",
      selectors: ["미국", "한국", "중국"],
      selectorLanguage: "ko",
      answer: "미국",
    },
  },
  {
    type: ELessonType.Mapping,
    value: {
      selectors: ["미국", "멕시코", "중국"],
      answers: ["United States", "Mexico", "China"],
      selectorLanguage: "ko",
      questionLanguage: "en",
    },
  },
  {
    type: ELessonType.Listening,
    value: {
      selectors: ["선생님", "학생", "의사"],
      selectorLanguage: "ko",
      answer: "선생님",
    },
  },
  {
    type: ELessonType.SingleChoose,
    value: {
      image: 'https://www.pallikkutam.com/uploads/webzines/1735619741.jpg',
      // question: "저는 학생이에요.",
      selectors: ["선생님", "학생"],
      answer: "학생",
      selectorLanguage: "ko",
    },
  },
  {
    type: ELessonType.WriteOnlyWord,
    value: {
      question: "한국 사람",
      answer: "한국 사람",
      questionLanguage: "ko",
    },
  },
  {
    type: ELessonType.SingleChoose,
    value: {
      question: "한국 사람.",
      selectors: ["American", "Korean", "Korean Doctor"],
      answer: "Korean",
      questionLanguage: "ko",
      selectorLanguage: "en",
    },
  },
  {
    type: ELessonType.Sentence,
    value: {
      question: "I am a student.",
      questionLanguage: "en",
      selectors: ["이에요", "사람이에요", "학생", "선생님", "저는", "학생"],
      selectorLanguage: "ko",
      answers: ["저는", "사람이에요"],
    },
  },
  // {
  //   type: ELessonType.SingleChoose,
  //   value: {
  //     question: "저는 한국 ______",
  //     selectors: ["이에요", "예요", "사람이에요"],
  //     answer: "사람이에요",
  //     audioLanguage: "ko",
  //   },
  // },
  {
    type: ELessonType.WriteWord,
    value: {
      question: "I am American.",
      selectors: ["___ 사람이에요."],
      answer: "미국",
    },
  },
  {
    type: ELessonType.Listening,
    value: {
      selectors: ["저는 학생이에요.", "저는 선생님이에요.", "선생님은 저예요."],
      selectorLanguage: "ko",
      answer: "저는 선생님이에요.",
    },
  },
  {
    type: ELessonType.SingleChoose,
    value: {
      question: "박지훈____ 선생님이에요.",
      selectors: ["은", "는"],
      questionLanguage: "ko",
      selectorLanguage: "ko",
      answer: "은",
    },
  },
  {
    type: ELessonType.Sentence,
    value: {
      question: "I am American.",
      questionLanguage: "en",
      selectors: ["이에요", "선생님은", "학생", "한국", "저는", "사람이에요"],
      selectorLanguage: "ko",
      answers: ["저는", "사람이에요"],
    },
  },
  {
    type: ELessonType.SingleChoose,
    value: {
      question: "안녕하세요",
      questionLanguage: "ko",
      selectors: ["Goodbye", "Thanks", "Hello"],
      selectorLanguage: "en",
      answer: "Hello",
    },
  },
  {
    type: ELessonType.Speaking,
    value: {
      question: "안녕하세요?",
      questionLanguage: "ko",
      answer: "안녕하세요?",
    },
  },

  {
    type: ELessonType.Speaking,
    value: {
      question: "저는 민준이에요",
      questionLanguage: "ko",
      answer: "저는 민준이에요",
    },
  },
  {
    type: ELessonType.Speaking,
    value: {
      question: "저는 베트남 사람이에요.",
      questionLanguage: "ko",
      answer: "저는 베트남 사람이에요.",
    },
  },
];
// .reverse()
// .slice(0, 3)
// .reverse();
// .reverse()
// .slice(0, 3)
// .reverse();
// .slice(0, 4);
