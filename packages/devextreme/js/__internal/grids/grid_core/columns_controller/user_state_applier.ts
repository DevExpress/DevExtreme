import { isDefined, isString } from '@js/core/utils/type';

import { applyColumnStateFields, checkUserStateColumn } from './m_columns_controller_utils';
import type {
  Column,
  ColumnsStateMatch,
  ColumnUserState,
  UserStateApplierOptions,
  UserStateApplyResult,
} from './types';

export class UserStateApplier {
  private readonly matchCountById: Record<string, number> = {};

  constructor(private readonly options: UserStateApplierOptions) {}

  public apply(): UserStateApplyResult {
    const { stateIndexes, allColumnsHaveState } = this.matchColumnsWithState();
    const columns = this.applyStateToColumns(stateIndexes, allColumnsHaveState);
    const hasAddedBands = this.appendAddedColumns(columns);

    return { columns, hasAddedBands };
  }

  private findMatchIndex(candidates: ColumnUserState[], target: ColumnUserState): number {
    const id = String(target.name || target.dataField);
    let skipCount = this.matchCountById[id] ?? 0;

    for (let index = 0; index < candidates.length; index += 1) {
      if (checkUserStateColumn(target, candidates[index])) {
        if (!skipCount) {
          this.matchCountById[id] = (this.matchCountById[id] ?? 0) + 1;
          return index;
        }

        skipCount -= 1;
      }
    }

    return -1;
  }

  private matchColumnsWithState(): ColumnsStateMatch {
    const { columns, columnsUserState } = this.options;
    const stateIndexes = columns.map((column) => this.findMatchIndex(columnsUserState, column));

    return {
      stateIndexes,
      allColumnsHaveState: stateIndexes.every((stateIndex) => stateIndex >= 0),
    };
  }

  private applyStateToColumns(stateIndexes: number[], allColumnsHaveState: boolean): Column[] {
    const {
      columns, columnsUserState, hasUserState, ignoreColumnOptionNames,
    } = this.options;
    const canApplyState = hasUserState || allColumnsHaveState;
    const resultColumns: Column[] = [];

    columns.forEach((column, index) => {
      const stateIndex = stateIndexes[index];
      const columnState = stateIndex >= 0 ? columnsUserState[stateIndex] : undefined;

      if (canApplyState) {
        applyColumnStateFields(column, columnState, ignoreColumnOptionNames);
      }

      if (isDefined(columnState?.initialIndex)) {
        resultColumns[stateIndex] = column;
      } else {
        resultColumns.push(column);
      }
    });

    return resultColumns;
  }

  private appendAddedColumns(resultColumns: Column[]): boolean {
    const {
      columns, columnsUserState, ignoreColumnOptionNames, createColumn,
    } = this.options;
    let hasAddedBands = false;

    columnsUserState.forEach((columnState) => {
      const { added } = columnState;

      if (added && this.findMatchIndex(columns, columnState) < 0) {
        const column = createColumn(added);

        applyColumnStateFields(column, columnState, ignoreColumnOptionNames);
        resultColumns.push(column);

        if (!isString(added) && added.columns) {
          hasAddedBands = true;
        }
      }
    });

    return hasAddedBands;
  }
}
