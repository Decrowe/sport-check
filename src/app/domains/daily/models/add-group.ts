import { ExerciseGoal } from './exercise-goal';

export type AddGroup = {
  name: string;
  exercises: ExerciseGoal[];
  members: string[];
  description?: string;
  ownerId: string;
  ownerName: string;
};
