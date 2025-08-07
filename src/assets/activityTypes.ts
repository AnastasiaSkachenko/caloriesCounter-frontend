import { ActivityType } from "../components/interfaces";


export const activityTypes: {type: ActivityType, label: string}[] = [
  { type: 'workout', label: 'Workout' },
  { type: 'tabata', label: 'Tabata' },
  { type: 'run', label: 'Running' },
  { type: 'walk_time', label: 'Walking (Time)' },
  { type: 'walk_steps', label: 'Walking (Steps)' },
  { type: 'interval_run', label: 'Interval Run' },
  { type: 'volleyball', label: 'Volleyball' },
  { type: 'jumping', label: 'Jumping' },
  { type: 'stretching', label: 'Stretching' },
  { type: 'home_chores', label: 'Home chores'}
] as const;
