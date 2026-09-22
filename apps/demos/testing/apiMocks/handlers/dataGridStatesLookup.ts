import type { MockHandler } from '../types';
import { aspNetLoadHandler } from '../aspNet/store';
import statesLookup from '../fixtures/statesLookup.json';

export const dataGridStatesLookupHandler: MockHandler = aspNetLoadHandler(
  '/api/DataGridStatesLookup',
  statesLookup,
);
