import { ExerciseUnit } from './exercise-unit';

export type Exercise = {
  id: number;
  name: string;
  target: number;
  unit: ExerciseUnit;
};
