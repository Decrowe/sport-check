import { ExerciseUnit } from './exercise-unit';

export type Exercise = {
  id: string;
  name: string;
  target: number;
  unit: ExerciseUnit;
};
