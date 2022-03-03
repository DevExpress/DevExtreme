import {
  Component, JSXComponent, ComponentBindings, OneWay, Effect, Slot, InternalState, Consumer,
} from '@devextreme-generator/declarations';
import { combineClasses } from '../../../../utils/combine_classes';
import { createGetter, PluginsContext, Plugins } from '../../../../utils/plugin/context';
import { Row } from '../types';
import CLASSES from '../classes';

export type RowPropertiesGetterType = (row: Row) => Record<string, unknown>;
export const RowPropertiesGetter = createGetter<RowPropertiesGetterType>(() => ({}));
export type RowClassesGetterType = (row: Row) => Record<string, boolean>;
export const RowClassesGetter = createGetter<RowClassesGetterType>(() => ({}));

export const viewFunction = (viewModel: RowBase): JSX.Element => (
  <tr
    className={viewModel.cssClasses}
    role="row"
    aria-selected="false"
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.additionalParams}
  >
    {viewModel.props.children}
  </tr>
);

@ComponentBindings()
export class RowBaseProps {
  @OneWay()
  row: Row = {
    data: {},
    rowType: 'data',
  };

  @Slot()
  children?: JSX.Element | JSX.Element[];
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class RowBase extends JSXComponent(RowBaseProps) {
  @Consumer(PluginsContext)
  plugins = new Plugins();

  get cssClasses(): string {
    return combineClasses({
      [CLASSES.row]: true,
      [CLASSES.columnLines]: true,
      ...this.additionalClasses,
    });
  }

  @InternalState()
  additionalParams: Record<string, unknown> = {};

  @InternalState()
  additionalClasses: Record<string, boolean> = {};

  @Effect()
  watchAdditionalParams(): () => void {
    return this.plugins.watch(RowPropertiesGetter, (getter) => {
      this.additionalParams = getter(this.props.row);
    });
  }

  @Effect()
  watchAdditionalClasses(): () => void {
    return this.plugins.watch(RowClassesGetter, (getter) => {
      this.additionalClasses = getter(this.props.row);
    });
  }
}
