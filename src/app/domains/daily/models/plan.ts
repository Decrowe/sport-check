import { ExerciseGoal } from './exercise';

export type Plan = {
  id: string;
  name: string;
  description?: string;
  exercises: ExerciseGoal[];
};
