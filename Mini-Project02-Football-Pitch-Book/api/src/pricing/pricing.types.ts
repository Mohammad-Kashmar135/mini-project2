export interface QuoteHour {
  startTime: string;
  price: number;
  isPeak: boolean;
}

export interface Quote {
  pitchId: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  hours: QuoteHour[];
  totalPrice: number;
}
