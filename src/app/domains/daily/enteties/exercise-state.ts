export type ExerciseState = {
  exerciseId: number;
  memberId: number;
  /**
   * Must be between 0 and 100 (percentage of completion)
   */
  progress: number;
  date: Date;
};
