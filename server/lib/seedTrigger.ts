import { ensureDbQuestionsSeeded } from './seed';

// Trigger lazy seed once the process is up.
setTimeout(ensureDbQuestionsSeeded, 3000);

export {};
