export type Profile = {
  id: string;
  full_name: string | null;
  created_at: string;
};

export type Checkin = {
  id: string;
  user_id: string;
  mood: number;
  note: string | null;
  created_at: string;
};

export type Habit = {
  id: string;
  user_id: string;
  name: string;
  archived: boolean;
  created_at: string;
};

export type HabitLog = {
  id: string;
  habit_id: string;
  user_id: string;
  completed_date: string;
  created_at: string;
};

export type HabitWithStreak = Habit & {
  streak: number;
  completedToday: boolean;
};
