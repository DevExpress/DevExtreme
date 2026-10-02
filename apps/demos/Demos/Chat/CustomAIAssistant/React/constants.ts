import type { FormActionType, RouterTarget } from './data.ts';

export const ROUTER_TARGETS = new Set<RouterTarget>(['form', 'grid', 'mixed', 'none']);
export const FORM_ACTION_TYPES = new Set<FormActionType>(['clear_field', 'clear_all', 'smart_paste']);
