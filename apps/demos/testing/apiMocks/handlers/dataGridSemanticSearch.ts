import type { MockHandler } from '../types';
import { aspNetLoadHandler } from '../aspNet/store';
import semanticSearch from '../fixtures/semanticSearch.json';

export const dataGridSemanticSearchGetHandler: MockHandler = aspNetLoadHandler(
  '/api/DataGridSemanticSearch/Get',
  semanticSearch,
);
