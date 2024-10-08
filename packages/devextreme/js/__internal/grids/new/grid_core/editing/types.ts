export interface Change {
  type: 'update';
  key: unknown;
  data: unknown;
}

export interface EditingProperties {
  editingChanges?: Change[];
}
