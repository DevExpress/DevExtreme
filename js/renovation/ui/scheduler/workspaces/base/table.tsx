import {
  Component, ComponentBindings, JSXComponent, OneWay, Slot, Fragment,
} from 'devextreme-generator/component_declaration/common';
import { Row } from './row';
import { addHeightToStyle } from '../utils';

export const viewFunction = (viewModel: Table): JSX.Element => (
  <table
        // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    className={viewModel.props.className}
    style={viewModel.style}
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

  @OneWay() height?: number;

  @Slot() children?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Table extends JSXComponent(TableProps) {
  get style(): { [key: string]: string | number | undefined } {
    const { height } = this.props;
    const { style } = this.restAttributes;

    return addHeightToStyle(height, style);
  }
}
