import { ExerciseGoal } from './exercise-goal';

export type Group = {
  id: string;
  name: string;
  members: string[];
  exercises: ExerciseGoal[];
  description?: string;
  ownerId: string;
  ownerName: string;
};

export function isMemberOfGroup(memberId: string, group: Group): boolean {
  return group.members.includes(memberId);
}
