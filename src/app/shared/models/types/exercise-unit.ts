export const ExerciseUnits = {
  Repetitions: 'repetitions',
  Meters: 'meters',
  Km: 'km',
  Laps: 'laps',
  Seconds: 'seconds',
  Minutes: 'minutes',
  Hours: 'hours',
  Unknown: 'unknown',
} as const;

export type ExerciseUnit = (typeof ExerciseUnits)[keyof typeof ExerciseUnits];
