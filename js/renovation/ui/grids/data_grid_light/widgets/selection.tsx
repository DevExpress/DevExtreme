/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable max-classes-per-file */
import {
  Component, JSXComponent, ComponentBindings,
  TwoWay, Fragment, Consumer, Effect, OneWay, Method,
} from '@devextreme-generator/declarations';
import { Plugins, PluginsContext, createValue } from '../../../../utils/plugin/context';

import { SelectionCheckbox } from './select_checkbox';
import { SelectAllCheckbox } from './select_all_checkbox';

import { VisibleColumns, VisibleItems } from '../data_grid_light';
import { Column, RowData } from '../types';
import { DataRowClassesGetter, DataRowPropertiesGetter } from './data_row';
import { RowClick } from '../views/table_content';

export const SetSelected = createValue<(data: RowData, value: boolean) => void>();
export const IsSelected = createValue<(data: RowData) => boolean>();
export const SelectAll = createValue<() => void>();
export const ClearSelection = createValue<() => void>();
export const SelectedCount = createValue<number>();
export const SelectableCount = createValue<number>();

export const viewFunction = (): JSX.Element => <Fragment />;

@ComponentBindings()
export class SelectionProps {
  @TwoWay()
  selectedRowKeys: number[] = [];

  @OneWay()
  mode: 'multiple' | 'single' | 'none' = 'single';

  @OneWay()
  allowSelectAll = true;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Selection extends JSXComponent(SelectionProps) {
  @Consumer(PluginsContext)
  plugins = new Plugins();

  @Effect()
  addVisibleColumnsHandler(): () => void {
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

  @Effect()
  addPluginValues(): void {
    this.plugins.set(SetSelected, this.setSelected);
    this.plugins.set(IsSelected, this.isSelected);
    this.plugins.set(ClearSelection, this.clearSelection);
    this.plugins.set(SelectAll, this.selectAll);
    this.plugins.set(SelectedCount, this.selectedCount());
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
    const items = this.plugins.getValue(VisibleItems) ?? [];
    this.props.selectedRowKeys = items.map((item) => item.id as number);
  }

  @Method()
  clearSelection(): void {
    this.props.selectedRowKeys = [];
  }

  isSelected(data: RowData): boolean {
    return this.props.selectedRowKeys.includes(data.id as number);
  }

  setSelected(data: RowData, value: boolean): void {
    if (value) {
      if (this.props.mode === 'multiple') {
        this.props.selectedRowKeys = [
          ...this.props.selectedRowKeys,
          data.id as number,
        ];
      } else {
        this.props.selectedRowKeys = [data.id as number];
      }
    } else {
      this.props.selectedRowKeys = this.props.selectedRowKeys.filter((i) => i !== data.id);
    }
  }

  selectedCount(): number {
    return this.props.selectedRowKeys.length;
  }

  selectableCount(): number {
    return this.plugins.getValue(VisibleItems)?.length ?? 0;
  }

  invertSelected(data: RowData): void {
    const isSelected = this.isSelected(data);
    this.setSelected(data, !isSelected);
  }
}
