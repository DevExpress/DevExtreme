/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable max-classes-per-file */
import {
  Component, JSXComponent, ComponentBindings,
  TwoWay, Consumer, Effect, OneWay, Method, InternalState,
} from '@devextreme-generator/declarations';
import { Plugins, PluginsContext } from '../../../../utils/plugin/context';

import { SelectionCheckbox } from './select_checkbox';
import { SelectAllCheckbox } from './select_all_checkbox';

import {
  KeyExprPlugin, VisibleColumns, VisibleItems, Items,
} from '../data_grid_light';
import {
  Column, KeyExpr, RowData, Key,
} from '../types';
import { RowClassesGetter, RowPropertiesGetter } from '../widgets/row_base';
import { RowClick } from '../views/table_content';
import {
  ClearSelection, IsSelected, SelectableCount, SelectAll, SelectedCount, SetSelected,
} from './plugins';
import CLASSES from '../classes';
import { createGetKey } from '../utils';

const getKey = createGetKey('Selection');

export const viewFunction = (): JSX.Element => <div />;

@ComponentBindings()
export class SelectionProps {
  @TwoWay()
  selectedRowKeys: Key[] = [];

  @OneWay()
  mode: 'multiple' | 'single' | 'none' = 'single';

  @OneWay()
  allowSelectAll = true;

  @OneWay()
  selectAllMode: 'allPages' | 'page' = 'allPages';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Selection extends JSXComponent(SelectionProps) {
  @Consumer(PluginsContext)
  plugins = new Plugins();

  @InternalState()
  keyExpr?: KeyExpr;

  @Effect()
  watchKeyExpr(): () => void {
    return this.plugins.watch(KeyExprPlugin, (keyExpr) => {
      this.keyExpr = keyExpr;
    });
  }

  @Effect()
  addVisibleColumnsHandler(): (() => void) | undefined {
    if (this.props.mode !== 'none') {
      return this.plugins.extend(VisibleColumns, 2, (columns) => {
        const selectColumn: Column = { cellTemplate: SelectionCheckbox };

        if (this.props.mode === 'multiple' && this.props.allowSelectAll) {
          selectColumn.headerTemplate = SelectAllCheckbox;
        }

        return [
          selectColumn,
          ...columns,
        ];
      });
    }
    return undefined;
  }

  @Effect()
  addPluginMethods(): void {
    this.plugins.set(SetSelected, this.setSelected);
    this.plugins.set(IsSelected, this.isSelected);
    this.plugins.set(ClearSelection, this.clearSelection);
    this.plugins.set(SelectAll, this.selectAll);
  }

  @Effect()
  addPluginValues(): void {
    this.plugins.set(SelectedCount, this.props.selectedRowKeys.length);
    this.plugins.set(SelectableCount, this.selectableCount());
  }

  @Effect()
  extendDataRowAttributes(): () => void {
    return this.plugins.extend(
      RowPropertiesGetter, 1,
      (base) => (row): Record<string, unknown> => {
        if (row.rowType === 'data' && this.isSelected(row.data)) {
          return {
            ...base(row),
            'aria-selected': true,
          };
        }
        return base(row);
      },
    );
  }

  @Effect()
  extendDataRowClasses(): () => void {
    return this.plugins.extend(
      RowClassesGetter, 1,
      (base) => (row): Record<string, boolean> => {
        if (row.rowType === 'data' && this.isSelected(row.data)) {
          return {
            ...base(row),
            [CLASSES.selectedRow]: true,
          };
        }
        return base(row);
      },
    );
  }

  @Effect()
  setRowClickEvent(): void {
    this.plugins.set(RowClick, (row) => {
      this.invertSelected(row.data);
    });
  }

  @Method()
  selectAll(): void {
    const items = this.getAllItems();
    this.props.selectedRowKeys = items.map((item) => getKey(item, this.keyExpr));
  }

  @Method()
  clearSelection(): void {
    this.props.selectedRowKeys = [];
  }

  isSelected(data: RowData): boolean {
    return this.props.selectedRowKeys.includes(getKey(data, this.keyExpr));
  }

  setSelected(data: RowData, value: boolean): void {
    const key = getKey(data, this.keyExpr);

    if (value) {
      if (this.props.mode === 'multiple') {
        this.props.selectedRowKeys = [
          ...this.props.selectedRowKeys,
          key,
        ];
      } else {
        this.props.selectedRowKeys = [key];
      }
    } else {
      this.props.selectedRowKeys = this.props.selectedRowKeys
        .filter((i) => i !== key);
    }
  }

  selectableCount(): number {
    const items = this.getAllItems();
    return items.length;
  }

  invertSelected(data: RowData): void {
    const isSelected = this.isSelected(data);
    this.setSelected(data, !isSelected);
  }

  getAllItems(): RowData[] {
    return (
      this.props.selectAllMode === 'allPages'
        ? this.plugins.getValue(Items)
        : this.plugins.getValue(VisibleItems)
    ) ?? [];
  }
}
