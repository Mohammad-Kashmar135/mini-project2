export interface Pitch {
  id: string;
  name: string;
  type: '5-a-side' | '7-a-side';
  description: string;
  surface: string;
  normalPricePerHour: number;
  peakPricePerHour: number;
  openingTime: string;
  closingTime: string;
}