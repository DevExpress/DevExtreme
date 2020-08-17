import {
  Component, ComponentBindings, JSXComponent, Template,
} from 'devextreme-generator/component_declaration/common';
import { CellBase as Cell, CellBaseProps } from '../cell';

export const viewFunction = (viewModel: DateTableCellBase): JSX.Element => {
  const DataCellTemplate = viewModel.props.dataCellTemplate;

  return (
    <Cell
    // eslint-disable-next-line react/jsx-props-no-spreading
      {...viewModel.restAttributes}
      isFirstCell={viewModel.props.isFirstCell}
      isLastCell={viewModel.props.isLastCell}
      className={
        `dx-scheduler-date-table-cell dx-scheduler-cell-sizes-horizontal
        dx-scheduler-cell-sizes-vertical ${viewModel.props.className}`
      }
    >
      {DataCellTemplate && (
        <DataCellTemplate
          data={{
            startDate: viewModel.props.startDate,
            endDate: viewModel.props.endDate,
            text: viewModel.props.text,
          }}
          // index={viewModel.props.index}
        />
      )}
      {!DataCellTemplate && viewModel.props.children}
    </Cell>
  );
};

@ComponentBindings()
export class DateTableCellBaseProps extends CellBaseProps {
  @Template() dataCellTemplate?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DateTableCellBase extends JSXComponent(DateTableCellBaseProps) {}
