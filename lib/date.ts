export function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

export function isSameOrAfter(date: string, startDate: string) {
  return date >= startDate;
}

export function getMonthKey(date: string) {
  return date.slice(0, 7);
}

export function isDateInMonth(date: string, monthKey: string) {
  return date.startsWith(monthKey);
}
