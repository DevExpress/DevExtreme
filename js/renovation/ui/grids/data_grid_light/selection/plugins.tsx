import { RowData } from '../types';
import { createValue } from '../../../../utils/plugin/context';

export const SetSelected = createValue<(data: RowData, value: boolean) => void>();
export const IsSelected = createValue<(data: RowData) => boolean>();
export const SelectAll = createValue<() => void>();
export const ClearSelection = createValue<() => void>();
export const SelectedCount = createValue<number>();
export const SelectableCount = createValue<number>();
