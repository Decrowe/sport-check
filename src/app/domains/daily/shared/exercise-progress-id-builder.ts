export function BuildExerciseProgressId(exerciseId: string, memberId: string, date: Date): string {
  return `${exerciseId}-${memberId}-${date.toDateString()}`;
}
