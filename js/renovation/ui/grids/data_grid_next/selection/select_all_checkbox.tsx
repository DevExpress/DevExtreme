/* eslint-disable @typescript-eslint/no-extraneous-class */
import {
  Component, JSXComponent, ComponentBindings,
  Effect, InternalState, Consumer,
} from '@devextreme-generator/declarations';
import { Plugins, PluginsContext } from '../../../../utils/plugin/context';

import { CheckBox } from '../../../editors/check_box/check_box';
import {
  ClearSelection, SelectableCount, SelectAll, SelectedCount,
} from './plugins';

import CLASSES from '../classes';

export const viewFunction = (viewModel: SelectAllCheckbox): JSX.Element => (
  <CheckBox
    className={`${CLASSES.selectCheckbox} ${CLASSES.checkboxSize}`}
    value={viewModel.value}
    valueChange={viewModel.onValueChange}
  />
);

@ComponentBindings()
export class SelectAllCheckboxProps {}

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
      this.plugins.callAction(SelectAll);
    } else {
      this.plugins.callAction(ClearSelection);
    }
  }
}
