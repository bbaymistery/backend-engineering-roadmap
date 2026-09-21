/**
 * Utility (Köməkçi) funksiyası: Tarixləri YYYY-MM-DD formatına salır.
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
