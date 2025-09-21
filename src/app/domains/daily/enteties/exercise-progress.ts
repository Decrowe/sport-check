import { Timestamp } from '@firebase/firestore';

export type ExerciseProgress = {
  id: string;
  exerciseId: string;
  memberId: string;
  /**
   * Must be between 0 and 100 (percentage of completion)
   */
  progress: number;
  date: Date | Timestamp;
};
