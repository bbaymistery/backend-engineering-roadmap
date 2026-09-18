/**
 * Utility (Köməkçi) funksiyası: Mətni baş hərfi böyük formata salır (məs: "ali" -> "Ali").
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
