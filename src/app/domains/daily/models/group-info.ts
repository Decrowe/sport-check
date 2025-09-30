import { ExerciseGoal } from './exercise';

export type GroupInfo = {
  name: string;
  members: string[];
  exercises: ExerciseGoal[];
  description?: string;
};
