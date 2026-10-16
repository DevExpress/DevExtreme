import type { MockHandler } from '../types';
import { aspNetLoadHandler, aspNetMutationHandler } from '../aspNet/store';
import collaborativeEditing from '../fixtures/collaborativeEditing.json';

export const dataGridCollaborativeEditingHandlers: MockHandler[] = [
  aspNetLoadHandler(
    '/api/DataGridCollaborativeEditing',
    collaborativeEditing,
  ),
  aspNetMutationHandler(
    '/api/DataGridCollaborativeEditing',
  ),
];
