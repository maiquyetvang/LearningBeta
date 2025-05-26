import { ImageSourcePropType, View } from "react-native";
import { Text } from "../ui/text";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { H1, H2 } from "../ui/typography";
type LessonInfo = {
  id: string;
  title: string;
  description: string;
  image?: ImageSourcePropType;
  isCompleted?: boolean;
  learningPathId?: string;
};
type LearningPath = {
  id: string;
  title: string;
  description: string;
};
const lessons: LessonInfo[] = [
  {
    id: "1",
    title: "회사원이 아니에요",
    description: "I'm not a company employee",
    isCompleted: true,
    learningPathId: "1",
  },
  {
    id: "2",
    title: "회사원이 아니에요",
    description: "I'm not a company employee",
    isCompleted: false,
    learningPathId: "1",
  },
  {
    id: "3",
    title: "회사원이 아니에요",
    description: "I'm not a company employee",
    isCompleted: false,
    learningPathId: "1",
  },
  {
    id: "4",
    title: "회사원이 아니에요",
    description: "I'm not a company employee",
    isCompleted: false,
    learningPathId: "1",
  },
  {
    id: "5",
    title: "회사원이 아니에요",
    description: "I'm not a company employee",
    isCompleted: false,
    learningPathId: "1",
  },
];
const learningPath: LearningPath = {
  id: "1",
  title: "Korean Beginner",
  description: "Learn the basics of Korean language.",
};
export default function LearningPath() {
  const learningPathData = learningPath;
  const lessonData = lessons.filter(
    (lesson) => lesson.learningPathId === learningPathData.id
  );
  const totalLessons = lessonData.length;
  const progress =
    (lessonData.filter((lesson) => lesson.isCompleted).length / totalLessons) *
    100;
  const isCompleted = lessonData.every((lesson) => lesson.isCompleted);
  const findCurrentLesson = lessonData.find(
    (lesson) => !lesson.isCompleted
  )?.id;
  const lastLessonId = lessonData[lessonData.length - 1].id;
  return (
    <View>
      <Text className='font-semibold  text-neutral-500'>Learning Path</Text>
      <View className='p-3 gap-5 rounded-lg bg-neutral-50 dark:bg-neutral-900'>
        {/* Header */}
        <View className='gap-3'>
          <View className='gap-3 justify-between items-center flex-row'>
            <Text className='text-neutral-800 font-semibold'>
              {learningPathData.title.toLocaleUpperCase()}
            </Text>
            <Text className='text-primary bg-primary-50'>
              {!isCompleted && "Learning"}
            </Text>
          </View>
          <View className='flex-row  items-center flex-1 gap-2'>
            <Progress
              value={progress}
              className='bg-neutral-200 flex-1 h-2 '
              indicatorClassName='bg-primary'
            />
            <Text>{progress}%</Text>
          </View>
        </View>
        {/* Completed Lesson */}
        <View className='gap-3'>
          <View className='items-center gap-2 flex-row'>
            <Text className='text-neutral-400'>Completed Lessons</Text>
            <View className='border-t flex-1 border-neutral-400'></View>
          </View>
          {lessonData
            .filter((lesson) => lesson.isCompleted)
            .map((lesson) => (
              <RenderLesson key={lesson.id} lesson={lesson} allowLeaning />
            ))}
        </View>
        {/* On Process Lessons */}
        <View className='gap-3'>
          <View className='items-center gap-2 flex-row'>
            <Text className='text-neutral-400'>On Process Lessons</Text>
            <View className='border-t flex-1 border-neutral-400'></View>
          </View>
          {lessonData
            .filter((lesson) => !lesson.isCompleted)
            .map((lesson) => (
              <RenderLesson
                key={lesson.id}
                lesson={lesson}
                allowLeaning={lesson.id === findCurrentLesson}
                isFinalLesson={lesson.id === lastLessonId}
              />
            ))}
        </View>
      </View>
    </View>
  );
}

const RenderLesson = ({
  lesson,
  onReview,
  onLearn,
  allowLeaning = false,
  isFinalLesson = false,
}: {
  lesson: LessonInfo;
  allowLeaning?: boolean;
  isFinalLesson?: boolean;
  onReview?: (id: string) => void;
  onLearn?: (id: string) => void;
}) => {
  const { id, title, description, isCompleted } = lesson;
  const handlePress = () => {
    if (isCompleted) {
      onReview?.(id);
    }
    if (!isCompleted) {
      onLearn?.(id);
    }
  };
  return (
    <View className='border border-neutral-100 bg-background gap-3   p-3 rounded-lg'>
      <View className='flex-row  items-center gap-2'>
        <H1
          className={`text-center w-12 ${isCompleted ? "text-success" : "text-neutral-500"}`}
        >
          {id}
        </H1>
        <View className='gap-2 text-foreground flex-1'>
          <Text className='text-neutral-800 text-lg font-semibold'>
            {isFinalLesson ? "Review Test" : title}
          </Text>
          <Text className='text-neutral-500 '>
            {isFinalLesson
              ? "You have to completed all lesson above to take this test"
              : description}
          </Text>
        </View>
      </View>
      <Button
        variant={isCompleted ? "neutral" : "default"}
        onPress={handlePress}
        className='w-full'
        disabled={!allowLeaning}
      >
        <Text>
          {isCompleted
            ? "Review Lesson"
            : isFinalLesson
              ? "Take a test"
              : "Learning"}
        </Text>
      </Button>
    </View>
  );
};
