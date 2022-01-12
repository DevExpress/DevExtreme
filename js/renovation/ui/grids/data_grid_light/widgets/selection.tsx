/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable max-classes-per-file */
import {
  Component, JSXComponent, ComponentBindings,
  TwoWay, Fragment, Consumer, Effect, OneWay, Method, InternalState,
} from '@devextreme-generator/declarations';
import { Plugins, PluginsContext } from '../../../../utils/plugin/context';

import { SelectionCheckbox } from './select_checkbox';
import { SelectAllCheckbox } from './select_all_checkbox';

import {
  KeyExprPlugin, VisibleColumns, VisibleItems, DataSource,
} from '../data_grid_light';
import {
  Column, KeyExpr, RowData, Key,
} from '../types';
import { DataRowClassesGetter, DataRowPropertiesGetter } from './data_row';
import { RowClick } from '../views/table_content';
import {
  ClearSelection, IsSelected, SelectableCount, SelectAll, SelectedCount, SetSelected,
} from './selection_plugins';

export const viewFunction = (): JSX.Element => <Fragment />;

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
  keyExpr: KeyExpr = '';

  @Effect()
  watchKeyExpr(): () => void {
    return this.plugins.watch(KeyExprPlugin, (keyExpr) => {
      this.keyExpr = keyExpr;
    });
  }

  @Effect()
  addVisibleColumnsHandler(): (() => void) | undefined {
    if (this.props.mode !== 'none') {
      return this.plugins.extend(VisibleColumns, 1, (columns) => {
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
      DataRowPropertiesGetter, 1,
      (base) => (data): Record<string, unknown> => {
        if (this.isSelected(data)) {
          return {
            ...base(data),
            'aria-selected': true,
          };
        }
        return base(data);
      },
    );
  }

  @Effect()
  extendDataRowClasses(): () => void {
    return this.plugins.extend(
      DataRowClassesGetter, 1,
      (base) => (data): Record<string, boolean> => {
        if (this.isSelected(data)) {
          return {
            ...base(data),
            'dx-selection': true,
          };
        }
        return base(data);
      },
    );
  }

  @Effect()
  setRowClickEvent(): void {
    this.plugins.set(RowClick, (data) => {
      this.invertSelected(data);
    });
  }

  @Method()
  selectAll(): void {
    const items = this.getAllItems();
    this.props.selectedRowKeys = items.map((item) => item[this.keyExpr]);
  }

  @Method()
  clearSelection(): void {
    this.props.selectedRowKeys = [];
  }

  isSelected(data: RowData): boolean {
    return this.props.selectedRowKeys.includes(data[this.keyExpr]);
  }

  setSelected(data: RowData, value: boolean): void {
    if (value) {
      if (this.props.mode === 'multiple') {
        this.props.selectedRowKeys = [
          ...this.props.selectedRowKeys,
          data[this.keyExpr],
        ];
      } else {
        this.props.selectedRowKeys = [data[this.keyExpr]];
      }
    } else {
      this.props.selectedRowKeys = this.props.selectedRowKeys
        .filter((i) => i !== data[this.keyExpr]);
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
        ? this.plugins.getValue(DataSource)
        : this.plugins.getValue(VisibleItems)
    ) ?? [];
  }
}
