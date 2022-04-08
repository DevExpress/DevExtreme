import {
  Component, JSXComponent, ComponentBindings, Slot,
} from '@devextreme-generator/declarations';
import CLASSES from '../classes';

export const viewFunction = (viewModel: Table): JSX.Element => (
  <table className={`${CLASSES.table} ${CLASSES.fixedTable}`} role="presentation">
    <tbody role="presentation">
      {viewModel.props.children}
    </tbody>
  </table>
);

@ComponentBindings()
export class TableProps {
  @Slot() children?: JSX.Element;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Table extends JSXComponent(TableProps) {
}
