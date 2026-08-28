/** Rough reading time for Vietnamese/English mixed blog content (~200 wpm). */
export function estimateReadingMinutes(text: string): number {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} phút đọc`;
}
