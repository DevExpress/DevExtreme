import {
  Component, JSXComponent, ComponentBindings, OneWay, Effect, InternalState, Consumer,
} from '@devextreme-generator/declarations';
import { combineClasses } from '../../../../utils/combine_classes';
import { createGetter, PluginsContext, Plugins } from '../../../../utils/plugin/context';
import { Column, RowData } from '../types';

export type DataRowPropertiesGetterType = (data: RowData) => Record<string, unknown>;
export const DataRowPropertiesGetter = createGetter<DataRowPropertiesGetterType>(() => ({}));
export type DataRowClassesGetterType = (data: RowData) => Record<string, boolean>;
export const DataRowClassesGetter = createGetter<DataRowClassesGetterType>(() => ({}));

export const viewFunction = (viewModel: DataRow): JSX.Element => (
  <tr
    className={viewModel.cssClasses}
    role="row"
    aria-selected="false"
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.additionalParams}
  >
    {viewModel.props.columns.map((column, index) => {
      const { cellTemplate: CellTemplate, dataField } = column;
      return (
        <td
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          // TODO uncomment after https://trello.com/c/kVXfSWI7
          // aria-describedby={`dx-col-${index + 1}`}
          aria-selected="false"
          role="gridcell"
        >
          {
            CellTemplate
              ? <CellTemplate data={viewModel.props.data} />
              : dataField && `${viewModel.props.data[dataField]}`
          }
        </td>
      );
    })}
  </tr>
);

@ComponentBindings()
export class DataRowProps {
  @OneWay()
  data: RowData = {};

  @OneWay()
  rowIndex = 0;

  @OneWay()
  columns: Column[] = [];
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DataRow extends JSXComponent(DataRowProps) {
  @Consumer(PluginsContext)
  plugins = new Plugins();

  get cssClasses(): string {
    return combineClasses({
      'dx-row': true,
      'dx-data-row': true,
      'dx-column-lines': true,
      ...this.additionalClasses,
    });
  }

  @InternalState()
  additionalParams: Record<string, unknown> = {};

  @InternalState()
  additionalClasses: Record<string, boolean> = {};

  @Effect()
  watchAdditionalParams(): () => void {
    return this.plugins.watch(DataRowPropertiesGetter, (getter) => {
      this.additionalParams = getter(this.props.data);
    });
  }

  @Effect()
  watchAdditionalClasses(): () => void {
    return this.plugins.watch(DataRowClassesGetter, (getter) => {
      this.additionalClasses = getter(this.props.data);
    });
  }
}
