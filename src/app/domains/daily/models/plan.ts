import { ExerciseGoal } from './exercise-goal';

export type Plan = {
  id: string;
  name: string;
  description?: string;
  exercises: ExerciseGoal[];
};
