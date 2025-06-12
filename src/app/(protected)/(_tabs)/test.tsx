// import React from 'react';
// import { SafeAreaView, View } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import PullToRefreshWrapper from '~/components/common/PullToRefreshWrapper';
// import { Text } from '~/components/ui/text';
// import { useGetAchievements } from '~/feature/achievement/hook/use-achievements';
// import { useGetCourses } from '~/feature/lesson/hooks/use-get-courses';
// import { useGetLesson } from '~/feature/lesson/hooks/use-get-lesson';
// import { useGetLessonsByCourse } from '~/feature/lesson/hooks/use-get-lessons-by-course';
// import { useGetQuestions } from '~/feature/lesson/hooks/use-get-questions';
// import { useGetUserLearningStats } from '~/feature/lesson/hooks/use-get-user-learning-stats';

// const Test = () => {
//   const insets = useSafeAreaInsets();
//   const { data: achievement } = useGetAchievements();
//   const { data: userLearningStats } = useGetUserLearningStats();
//   const courseId = userLearningStats?.current_course_id || '';
//   const { data: courses } = useGetCourses(courseId);
//   const { data: lessons } = useGetLessonsByCourse(userLearningStats?.current_course_id || '');
//   const { data: lessonTest } = useGetLesson({ levelTest: true });
//   const { data: questions } = useGetQuestions(lessons?.[0]?.id ?? '');
//   // const { data: questionsTest } = useGetQuestions(lessons?.[0]?.id ?? '');
//   const lessonIDs = lessons?.map((lesson) => lesson.id);
//   console.log({ questions });

//   return (
//     <SafeAreaView className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
//       <PullToRefreshWrapper>
//         <View className="p-5 gap-5">
//           <Text className="text-sm">
//             {JSON.stringify(
//               {
//                 lessonTest,
//                 userLearningStats,
//                 lessonsLength: lessons?.length,
//                 lessons,
//                 questionsLength: questions?.length,
//                 questions,
//                 achievementLength: achievement?.length,
//                 achievement,
//                 // coursesLength: courses?.length,
//                 // courses,
//                 lessonIDsLength: lessonIDs?.length,
//                 lessonIDs,
//               },
//               null,
//               4,
//             )}
//           </Text>
//         </View>
//       </PullToRefreshWrapper>
//     </SafeAreaView>
//   );
// };

// export default Test;
