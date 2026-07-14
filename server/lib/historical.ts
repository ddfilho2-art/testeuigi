import { getSupabase } from './supabase';
import { fallbackResponses } from '../state';
import type { Submission } from '../../src/types';

const PAGE_SIZE = 1000;

/**
 * Reads the immutable response history without grouping, replacing, or
 * writing any row. Pagination is intentional because Supabase limits a
 * single REST response by default.
 */
export async function getHistoricalResponses(): Promise<Submission[]> {
  const supabase = getSupabase();
  if (!supabase) return fallbackResponses;

  const responses: Submission[] = [];
  let offset = 0;

  while (true) {
    const { data, error } = await supabase
      .from('responses')
      .select('*')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      throw new Error(`Erro ao consultar o histórico de respostas no Supabase: ${error.message}`);
    }

    const page = (data || []) as Submission[];
    responses.push(...page);

    if (page.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return responses;
}
