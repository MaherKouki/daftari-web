/** Logique métier de démonstration : niveau de maîtrise et note de l'enseignant. */

export type MasteryLevel = 'ok' | 'mid' | 'low';

export interface Mastery {
  level: MasteryLevel;
  label: string;
}

export interface DemoStudent {
  name: string;
  gender: 'f' | 'm';
  /** Un score (en %) par compétence, dans l'ordre de COMPETENCIES. */
  scores: number[];
}

export const COMPETENCIES = ['فهم المنطوق', 'القراءة', 'الإنتاج الكتابي', 'حلّ المسائل'] as const;

/** Seuils proposés par défaut (à rendre configurables par l'enseignant plus tard). */
export const MASTERY_HIGH = 75;
export const MASTERY_MID = 50;

export function masteryOf(score: number): Mastery {
  if (score >= MASTERY_HIGH) return { level: 'ok', label: 'متحكّم' };
  if (score >= MASTERY_MID) return { level: 'mid', label: 'في طريق التحكّم' };
  return { level: 'low', label: 'يحتاج دعمًا' };
}

/** Génère une phrase d'observation modifiable, à partir des scores (règles simples, sans IA). */
export function buildTeacherNote(student: DemoStudent): string {
  let best = 0;
  let worst = 0;
  student.scores.forEach((v, k) => {
    if (v > student.scores[best]) best = k;
    if (v < student.scores[worst]) worst = k;
  });
  const first = student.name.split(' ')[0];
  const verb = student.gender === 'f' ? 'أظهرت' : 'أظهر';
  const need = student.gender === 'f' ? 'وتحتاج' : 'ويحتاج';
  return (
    `${verb} ${first} تحكّمًا جيّدًا في ${COMPETENCIES[best]}، ${need} إلى مزيد من الدعم في ${COMPETENCIES[worst]}. ` +
    `نقترح تمارين قصيرة ومتدرّجة في ${COMPETENCIES[worst]} خلال الأسابيع القادمة.`
  );
}
