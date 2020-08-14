import {
  Component, ComponentBindings, JSXComponent, OneWay, Slot, Fragment,
} from 'devextreme-generator/component_declaration/common';
import { Row } from './row';

export const viewFunction = (viewModel: Table) => (
  <table
        // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    className={viewModel.props.className}
  >
    <tbody>
      <Fragment>
        {
        viewModel.props.isVirtual
        && <Row isVirtual height={viewModel.props.topVirtualRowHeight} />
        }
        {viewModel.props.children}
        {
        viewModel.props.isVirtual
         && <Row isVirtual height={viewModel.props.bottomVirtualRowHeight} />
        }
      </Fragment>
    </tbody>
  </table>
);

@ComponentBindings()
export class TableProps {
  @OneWay() className?: string = '';

  @OneWay() topVirtualRowHeight?: number = 0;

  @OneWay() bottomVirtualRowHeight?: number = 0;

  @OneWay() isVirtual?: boolean = false;

  @Slot() children?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Table extends JSXComponent(TableProps) {
}
