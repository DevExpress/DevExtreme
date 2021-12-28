import {
  Component, JSXComponent, ComponentBindings, OneWay,
  Event, RefObject, Effect, InternalState, JSXTemplate, Consumer,
} from '@devextreme-generator/declarations';
import { Plugins, PluginsContext } from '../../../../utils/plugin/context';

import { CheckBox } from '../../../editors/check_box/check_box';
import { RowData } from '../types';
import {
  ClearSelection, IsSelected, SelectableCount, SelectAll, SelectedCount, SetSelected,
} from './selection';

export const viewFunction = (viewModel: SelectAllCheckbox): JSX.Element => (
  <CheckBox
    className="dx-select-checkbox dx-datagrid-checkbox-size"
    value={viewModel.value}
    valueChange={viewModel.onValueChange}
  />
);

@ComponentBindings()
export class SelectAllCheckboxProps {
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class SelectAllCheckbox extends JSXComponent(SelectAllCheckboxProps) {
  @Consumer(PluginsContext)
  plugins: Plugins = new Plugins();

  @InternalState()
  selectedCount = 0;

  @InternalState()
  selectableCount = 0;

  @Effect()
  updateSelectableCount(): () => void {
    return this.plugins.watch(SelectableCount, (count) => {
      this.selectableCount = count;
    });
  }

  @Effect()
  updateSelectedCount(): () => void {
    return this.plugins.watch(SelectedCount, (count) => {
      this.selectedCount = count;
    });
  }

  get value(): boolean | null {
    if (this.selectedCount === 0) {
      return false;
    }
    if (this.selectedCount === this.selectableCount) {
      return true;
    }

    return null;
  }

  onValueChange(value: boolean): void {
    if (value) {
      this.plugins.getValue(SelectAll)?.();
    } else {
      this.plugins.getValue(ClearSelection)?.();
    }
  }
}
