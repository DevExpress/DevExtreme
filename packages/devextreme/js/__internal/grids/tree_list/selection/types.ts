export type SelectionStateByKey = Record<string, boolean | undefined>;

export interface TreeListSelectionControllerExtension {
  isRecursiveSelection: () => boolean | undefined;
  updateSelectionState: (options: {
    selectedItemKeys?: unknown[];
    removedItemKeys?: unknown[];
  }) => void;
}
