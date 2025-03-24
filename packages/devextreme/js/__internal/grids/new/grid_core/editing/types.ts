export interface Change {
  type: 'update' | 'insert' | 'remove';
  key: unknown;
  data: unknown;
}

export interface EditingProperties {
  editingChanges?: Change[];
}
