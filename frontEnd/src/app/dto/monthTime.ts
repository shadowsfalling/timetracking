export interface MonthTime {
    monthlyDefaultDuration: number;
    remainingTime: number;
    totalTime: number;
    dailySummaries: { [key: string]: number };
}