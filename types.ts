export interface Starter {
  id: number;
  category: string;
  text: string;
  questionType: string;
  focus: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface CategoryStats {
  name: string;
  count: number;
  color: string;
  icon: string;
}

export interface FilterState {
  search: string;
  category: string | null;
}

export type Theme = 'light' | 'dark' | 'nord' | 'dracula';