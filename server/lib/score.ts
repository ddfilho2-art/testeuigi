import type { Question } from '../../src/types';

// Local calculation logic (mirrors the Postgres PL/pgSQL `calculate_assessment_score`)
export function calculateLocalScore(answers: Record<string, string | number>, questions: Question[]) {
  let totalScore = 0;
  let maxPossible = 0;
  let minPossible = 0;

  const sectionSums: Record<string, number> = {};
  const sectionMaxes: Record<string, number> = {};
  const sectionMins: Record<string, number> = {};
  const sectionScores: Record<string, any> = {};

  for (const q of questions) {
    const val = answers[q.id];
    if (val !== undefined && val !== null) {
      let itemScore = 0;
      if (q.type === 'scale') {
        itemScore = Number(val);
        if (q.is_inverted) {
          itemScore = 6 - itemScore;
        }
        maxPossible += 5;
        minPossible += 1;
      } else if (q.type === 'boolean') {
        itemScore = val === 'Sim' ? 5 : 1;
        maxPossible += 5;
        minPossible += 1;
      }

      totalScore += itemScore;

      const secId = String(q.section_id);
      sectionSums[secId] = (sectionSums[secId] || 0) + itemScore;
      sectionMaxes[secId] = (sectionMaxes[secId] || 0) + 5;
      sectionMins[secId] = (sectionMins[secId] || 0) + 1;
    }
  }

  const finalPercentage = maxPossible - minPossible > 0
    ? Number(((totalScore - minPossible) / (maxPossible - minPossible) * 100).toFixed(2))
    : 0;

  let classification: 'Baixo' | 'Moderado' | 'Médio' | 'Alto' | 'Crítico' = 'Baixo';
  if (finalPercentage <= 20) classification = 'Baixo';
  else if (finalPercentage <= 40) classification = 'Moderado';
  else if (finalPercentage <= 60) classification = 'Médio';
  else if (finalPercentage <= 80) classification = 'Alto';
  else classification = 'Crítico';

  for (const secId of Object.keys(sectionSums)) {
    const sum = sectionSums[secId];
    const max = sectionMaxes[secId];
    const min = sectionMins[secId];
    const sPerc = max - min > 0 ? Number(((sum - min) / (max - min) * 100).toFixed(2)) : 0;
    sectionScores[secId] = { sum, max, min, percentage: sPerc };
  }

  return {
    total_score: finalPercentage,
    classification,
    section_scores: sectionScores,
    raw_score: totalScore,
    max_possible: maxPossible,
    min_possible: minPossible
  };
}
