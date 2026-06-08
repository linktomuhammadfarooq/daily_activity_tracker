export function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

export function isSameOrAfter(date: string, startDate: string) {
  return date >= startDate;
}
