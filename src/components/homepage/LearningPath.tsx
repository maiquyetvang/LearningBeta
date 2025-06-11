import React, { useEffect, useState } from 'react';
import { ImageSourcePropType, View } from 'react-native';
import { useGetCourse } from '~/hooks/useGetLessonById';
import { useNextLesson } from '~/hooks/useNextLesson';
import { FileText } from '~/lib/icons/FileText';
import { useLearningStore } from '~/stores/learning.store';
import ProgressBar from '../common/ProgressBar';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Text } from '../ui/text';
import { H1 } from '../ui/typography';
type LessonInfo = {
  id: string;
  title: string;
  description: string;
  image?: ImageSourcePropType;
  isCompleted?: boolean;
  learningPathId?: string;
};

export default function LearningPath({
  courseId,
  onReview,
  onLearn,
}: {
  courseId: string;
  onReview?: (id: string) => void;
  onLearn?: (id: string) => void;
}) {
  // const { data } = useGetCompletedUnit();
  const { data: course } = useGetCourse(courseId);
  const { nextLesson, lessonGroups, progress, checkIsCompleted } = useNextLesson(course);
  const { setCurrentCourse } = useLearningStore();

  // const checkIsCompleted = (lessonId: string) => {
  //   return completedUnit?.some((unit) => unit.lessonId === lessonId);
  // };

  // const totalLessons = lessonGroups.length;
  // const progress =
  //   (lessonGroups.filter((lesson) => checkIsCompleted(lesson.id)).length /
  //     totalLessons) *
  //   100;

  const handleLearn = (id: string) => {
    onLearn?.(id);
  };
  const isCompleted = progress === 100;
  useEffect(() => {
    setCurrentCourse(course);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course]);
  const lastLessonId = lessonGroups && lessonGroups[lessonGroups.length - 1]?.id;
  if (!course) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-neutral-500">No course data available</Text>
      </View>
    );
  }
  return (
    <View className="gap-3">
      {/* <Text>{JSON.stringify(course, null, 2)}</Text>
      <Text className='text-red-500'>
        {JSON.stringify(
          { title: "completedUnit", completedUnit, courseId },
          null,
          2
        )}
      </Text> */}
      <Text className="font-semibold  text-neutral-500  dark:text-neutral-300">Learning Path</Text>
      <View className="p-3 gap-5 rounded-lg bg-neutral-50 dark:bg-neutral-900">
        {/* Header */}
        <View className="gap-3">
          <View className="gap-3 justify-between items-center flex-row">
            <Text className="text-neutral-800 font-semibold dark:text-neutral-200">
              {course.title.toLocaleUpperCase()}
            </Text>
            <Text
              className={` py-1 px-2 rounded-md ${
                isCompleted
                  ? 'text-success-500 bg-success-50 dark:bg-success-900'
                  : 'text-primary bg-primary-50 dark:bg-primary-900'
              }`}
            >
              {isCompleted ? 'Completed' : 'Learning'}
            </Text>
          </View>
          <ProgressBar value={progress} />
        </View>
        {/* Completed Lesson */}
        {/* On Process Lessons */}
        <View className="gap-3">
          {progress > 0 && <Title title="Completed" />}
          {lessonGroups.map((lesson, index) => {
            const isCompleted = checkIsCompleted(lesson.id);
            const isCurrentLesson = lesson.id === nextLesson?.id;
            return (
              <View key={lesson.id} className="gap-3">
                {isCurrentLesson && <Title title="On Process" />}
                <RenderLesson
                  index={(index + 1).toString()}
                  lesson={lesson}
                  allowLeaning={isCurrentLesson || isCompleted}
                  onLearn={handleLearn}
                  onReview={handleLearn}
                  isFinalLesson={lesson.id === lastLessonId}
                />
                {index !== lessonGroups.length - 1 && isCurrentLesson && <Title title="Up Next" />}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const RenderLesson = ({
  index,
  lesson,
  onReview,
  onLearn,
  allowLeaning = false,
  isFinalLesson = false,
}: {
  index: string;
  lesson: LessonInfo;
  allowLeaning?: boolean;
  isFinalLesson?: boolean;
  onReview?: (id: string) => void;
  onLearn?: (id: string) => void;
}) => {
  const { id, title, description, isCompleted } = lesson;
  const { inProgressLesson, clearInProgressLesson } = useLearningStore();
  const [showDialog, setShowDialog] = useState(false);

  const hasOtherInProgress =
    inProgressLesson && inProgressLesson.lessonId && inProgressLesson.lessonId !== id;

  const handlePress = () => {
    if (hasOtherInProgress) {
      setShowDialog(true);
    } else {
      if (isCompleted) {
        onReview?.(id);
      } else {
        onLearn?.(id);
      }
    }
  };

  const handleResume = () => {
    setShowDialog(false);
    if (inProgressLesson) {
      onLearn?.(inProgressLesson.lessonId);
    }
  };

  const handleContinueNew = () => {
    setShowDialog(false);
    clearInProgressLesson();
    if (isCompleted) {
      onReview?.(id);
    } else {
      onLearn?.(id);
    }
  };

  return (
    <View
      className={`border border-neutral-100 bg-background gap-3  p-3 rounded-lg dark:border-neutral-800 ${!allowLeaning ? 'opacity-80' : ''} ${!isCompleted && allowLeaning ? '!border-primary !border' : ''}`}
    >
      <View className="flex-row  items-center gap-2">
        <View className="w-12 justify-center items-center">
          {isFinalLesson ? (
            <FileText
              size={32}
              className={
                isCompleted
                  ? 'text-success'
                  : allowLeaning
                    ? 'text-neutral-600 dark:text-neutral-300'
                    : 'text-neutral-200 dark:text-neutral-700'
              }
            />
          ) : (
            <H1
              className={`text-center ${isCompleted ? 'text-success' : allowLeaning ? 'text-neutral-600 dark:text-neutral-300' : 'text-neutral-200 dark:text-neutral-700'}`}
            >
              {index}
            </H1>
          )}
        </View>
        <View className="gap-2 text-foreground flex-1">
          <Text className="text-neutral-800 text-lg font-bold dark:text-neutral-200">
            {isFinalLesson ? 'Review Test' : title}
          </Text>
          <Text className="text-neutral-800 dark:text-neutral-200 ">
            {isFinalLesson
              ? 'You have to completed all lesson above to take this test'
              : description}
          </Text>
        </View>

        {/* {completedResult &&
          completedResult.correctAnswers &&
          completedResult.totalQuestions && (
            <View>
              <CircleProgress
                value={completedResult.correctAnswers}
                total={completedResult.totalQuestions}
                color='#22c55e'
                bgColor='#e5f9ee'
                textColor='#22c55e'
                size={32}
                strokeWidth={4}
              />
            </View>
          )} */}
      </View>
      <Button
        variant={isCompleted ? 'neutral' : 'default'}
        onPress={handlePress}
        className="w-full -mb-3"
        disabled={!allowLeaning}
      >
        <Text>
          {isCompleted
            ? 'Review Lesson'
            : isFinalLesson
              ? 'Take a test'
              : allowLeaning
                ? 'Start Learning'
                : 'Learn'}
        </Text>
      </Button>
      <Dialog open={showDialog} onOpenChange={() => setShowDialog(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-yellow-700 dark:text-yellow-500 font-semibold">
              Warning
            </DialogTitle>
          </DialogHeader>
          <Text>
            You have an unfinished lesson in progress. If you continue with this lesson, your
            previous progress will be lost!
          </Text>
          <DialogFooter>
            <Button onPress={handleResume} variant="neutral">
              <Text>Resume Unfinished Lesson</Text>
            </Button>
            <Button onPress={handleContinueNew} variant="default">
              <Text>Continue With This Lesson</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  );
};

const Title = ({ title }: { title: string }) => {
  return (
    <View className="items-center gap-2 flex-row">
      <Text className="text-neutral-400 ">{title}</Text>
      <View className="border-t flex-1 border-neutral-200 dark:border-neutral-700"></View>
    </View>
  );
};
