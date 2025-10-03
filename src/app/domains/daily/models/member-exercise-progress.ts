import { ExerciseProgress } from './exercise-progress';

export type MemberExerciseProgress = {
  memberId: string; // username
  date: string; // ISO 8601 date string (yyyy-mm-dd)
  progresses: ExerciseProgress[];
};

export const buildMemberExerciseProgressId = (memberId: string, date: string) =>
  `${memberId}_${date}`;
