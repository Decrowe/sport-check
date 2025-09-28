export type MemberExerciseProgress = {
  memberId: string; // username
  date: string; // ISO 8601 date string (yyyy-mm-dd)
  exercises: { id: string; amount: number }[];
};

export const buildMemberExerciseProgressId = (memberId: string, date: string) =>
  `${memberId}_${date}`;
