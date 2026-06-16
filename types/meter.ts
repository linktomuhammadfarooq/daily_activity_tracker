export type Meter = {
  id: string;
  ownerId: string;
  sharedWithUserIds: string[];
  name: string;
  openingReading: number;
  openingMonth: string;
  createdAt?: number;
};

export type MeterReading = {
  id: string;
  ownerId: string;
  meterId: string;
  date: string;
  readingValue: number;
  createdAt?: number;
  updatedAt?: number;
};

export type MeterUsageView = {
  meterId: string;
  ownerId: string;
  sharedWithUserIds: string[];
  meterName: string;
  openingReading: number;
  todayReading: number | null;
  previousReading: number;
  dailyUsage: number;
  currentMonthUsage: number;
};
