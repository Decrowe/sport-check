export function BuildExerciseProgressId(exerciseId: string, memberId: string, date: Date): string {
  console.log(date.toDateString());

  return `${exerciseId}-${memberId}-${date.toDateString()}`;
}
