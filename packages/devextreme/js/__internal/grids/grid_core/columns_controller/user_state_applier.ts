import { isDefined, isString } from '@js/core/utils/type';

import { applyColumnStateFields, isUserStateColumn } from './m_columns_controller_utils';
import type {
  Column,
  ColumnUserState,
  MatchCountById,
  UserStateApplierOptions,
  UserStateApplyResult,
} from './types';

export class UserStateApplier {
  constructor(private readonly options: UserStateApplierOptions) {}

  public apply(): UserStateApplyResult {
    const matchCountById: MatchCountById = new Map();
    const stateIndexes = this.matchColumnsWithState(matchCountById);
    const columns = this.applyStateToColumns(stateIndexes);
    const hasAddedBands = this.appendAddedColumns(columns, matchCountById);

    return { columns, hasAddedBands };
  }

  private findMatchIndex(
    candidates: ColumnUserState[],
    target: ColumnUserState,
    matchCountById: MatchCountById,
  ): number {
    const id = String(target.name || target.dataField);
    const matchCount = matchCountById.get(id) ?? 0;
    let skipCount = matchCount;

    for (let index = 0; index < candidates.length; index += 1) {
      if (isUserStateColumn(target, candidates[index])) {
        if (!skipCount) {
          matchCountById.set(id, matchCount + 1);
          return index;
        }

        skipCount -= 1;
      }
    }

    return -1;
  }

  private matchColumnsWithState(matchCountById: MatchCountById): number[] {
    const { columns, columnsUserState } = this.options;

    return columns.map((column) => this.findMatchIndex(columnsUserState, column, matchCountById));
  }

  private applyStateToColumns(stateIndexes: number[]): Column[] {
    const {
      columns, columnsUserState, hasUserState, ignoreColumnOptionNames,
    } = this.options;
    const allColumnsHaveState = stateIndexes.every((stateIndex) => stateIndex >= 0);
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

  private appendAddedColumns(resultColumns: Column[], matchCountById: MatchCountById): boolean {
    const {
      columns, columnsUserState, ignoreColumnOptionNames, createColumn,
    } = this.options;
    let hasAddedBands = false;

    columnsUserState.forEach((columnState) => {
      const { added } = columnState;

      if (added && this.findMatchIndex(columns, columnState, matchCountById) < 0) {
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
