import type { Question } from '../../src/types';

const TABLE = 'questions';

export async function ensureDbQuestionsSeeded(): Promise<void> {
  // Lazy import to avoid a circular dependency at module-load time.
  const { getSupabase } = await import('./supabase');
  const { fallbackQuestions } = await import('../state');

  const supabase = getSupabase();
  if (!supabase) return;

  try {
    const { count, error } = await supabase.from(TABLE).select('*', { count: 'exact', head: true });
    if (error) {
      console.warn('Could not check questions count for seeding:', error.message);
      return;
    }
    if (count === 0 && fallbackQuestions.length > 0) {
      const { error: seedError } = await supabase.from(TABLE).insert(fallbackQuestions);
      if (seedError) {
        console.warn('Failed to seed questions:', seedError.message);
      } else {
        console.log(`Seeded ${fallbackQuestions.length} default questions into Supabase.`);
      }
    }
  } catch (err) {
    console.error('Error during questions seeding:', err);
  }
}
