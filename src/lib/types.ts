export interface Allocation {
  id: string | number;
  label: string;
  amount: number;
  color: string;
  emoji: string;
  tip?: string;
  mode?: 'create' | 'edit';
}
