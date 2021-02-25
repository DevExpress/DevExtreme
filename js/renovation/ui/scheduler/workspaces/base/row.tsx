import {
  Component, ComponentBindings, JSXComponent, Slot, OneWay, Fragment,
} from 'devextreme-generator/component_declaration/common';
import { VirtualCell } from './virtual-cell';

export const viewFunction = ({
  props: {
    className,
    leftVirtualCellWidth,
    rightVirtualCellWidth,
    children,
  },
  hasLeftVirtualCell,
  hasRightVirtualCell,
  restAttributes,
}: Row): JSX.Element => (
  <tr
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
    className={className}
  >
    {/*
        This is a workaround for https://github.com/preactjs/preact/issues/2987
        TODO: remove once we start using inferno
      */}
    {hasLeftVirtualCell && hasRightVirtualCell && (
      <Fragment>
        <VirtualCell width={leftVirtualCellWidth} />
        {children}
        <VirtualCell width={rightVirtualCellWidth} />
      </Fragment>
    )}
    {hasLeftVirtualCell && !hasRightVirtualCell && (
      <Fragment>
        <VirtualCell width={leftVirtualCellWidth} />
        {children}
      </Fragment>
    )}
    {!hasLeftVirtualCell && hasRightVirtualCell && (
      <Fragment>
        {children}
        <VirtualCell width={rightVirtualCellWidth} />
      </Fragment>
    )}
    {!hasLeftVirtualCell && !hasRightVirtualCell && (
      <Fragment>
        {children}
      </Fragment>
    )}

    {/* {hasLeftVirtualCell && (
      <VirtualCell width={leftVirtualCellWidth} />
    )}

    {children}

    {hasRightVirtualCell && (
      <VirtualCell width={rightVirtualCellWidth} />
    )} */}
  </tr>
);

@ComponentBindings()
export class RowProps {
  @OneWay() className?: string = '';

  @OneWay() leftVirtualCellWidth = 0;

  @OneWay() rightVirtualCellWidth = 0;

  @Slot() children?: JSX.Element | JSX.Element[];
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Row extends JSXComponent(RowProps) {
  get hasLeftVirtualCell(): boolean {
    const { leftVirtualCellWidth } = this.props;

    return !!leftVirtualCellWidth;
  }

  get hasRightVirtualCell(): boolean {
    const { rightVirtualCellWidth } = this.props;

    return !!rightVirtualCellWidth;
  }
}
