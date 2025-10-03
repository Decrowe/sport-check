import { ExerciseGoal } from './exercise-goal';

export type GroupInfo = {
  name: string;
  members: string[];
  exercises: ExerciseGoal[];
  description?: string;
};
