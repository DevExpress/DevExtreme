import {
  Component, JSXComponent, ComponentBindings, OneWay,
} from '@devextreme-generator/declarations';
import { Column } from '../types';
import { HeaderCell } from './header_cell';

export const viewFunction = (viewModel: HeaderRow): JSX.Element => (
  <tr className="dx-row dx-column-lines dx-header-row" role="row">
    {viewModel.props.columns.map((column, index) => (
      <HeaderCell
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        column={column}
        countColumn={viewModel.props.columns.length}
        columnIndex={index}
      />
    ))}
  </tr>
);

@ComponentBindings()
export class HeaderRowProps {
  @OneWay()
  columns: Column[] = [];
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class HeaderRow extends JSXComponent(HeaderRowProps) {
}
