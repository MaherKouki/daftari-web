/** Niveaux du primaire (de la 1ère à la 6ème année). */
export const LEVELS = [
  { value: 1, label: 'السنة الأولى أساسي' },
  { value: 2, label: 'السنة الثانية أساسي' },
  { value: 3, label: 'السنة الثالثة أساسي' },
  { value: 4, label: 'السنة الرابعة أساسي' },
  { value: 5, label: 'السنة الخامسة أساسي' },
  { value: 6, label: 'السنة السادسة أساسي' },
] as const;

export function levelLabel(level: number): string {
  return LEVELS.find((l) => l.value === level)?.label ?? `المستوى ${level}`;
}