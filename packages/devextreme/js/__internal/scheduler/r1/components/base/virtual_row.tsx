import { BaseInfernoComponent } from '@devextreme/runtime/inferno';

import { renderUtils } from '../../utils/index';
import type { RowProps } from './row';
import { Row, RowDefaultProps } from './row';
import { VirtualCell, VirtualCellDefaultProps } from './virtual_cell';

export interface VirtualRowProps extends RowProps {
  height?: number;
  leftVirtualCellWidth: number;
  rightVirtualCellWidth: number;
  leftVirtualCellCount?: number;
  rightVirtualCellCount?: number;
  cellsCount: number;
}

export const VirtualRowDefaultProps: VirtualRowProps = {
  ...RowDefaultProps,
  leftVirtualCellWidth: 0,
  rightVirtualCellWidth: 0,
  cellsCount: 1,
};

export class VirtualRow extends BaseInfernoComponent<VirtualRowProps> {
  private virtualCells: unknown[] | null = null;

  private getVirtualCells(): unknown[] {
    if (this.virtualCells !== null) {
      return this.virtualCells;
    }

    const {
      cellsCount,
    } = this.props;
    this.virtualCells = [...Array(cellsCount)];

    return this.virtualCells;
  }

  componentWillUpdate(nextProps: VirtualRowProps): void {
    if (this.props.cellsCount !== nextProps.cellsCount) {
      this.virtualCells = null;
    }
  }

  render(): JSX.Element {
    const {
      className,
      leftVirtualCellCount,
      leftVirtualCellWidth,
      rightVirtualCellCount,
      rightVirtualCellWidth,
      styles,
      height,
    } = this.props;
    const classes = `dx-scheduler-virtual-row ${className}`;
    const modifiedStyles = renderUtils.addHeightToStyle(height, styles);
    const virtualCells = this.getVirtualCells();

    return (
      // @ts-expect-error TS2786
      <Row
        className={classes}
        styles={modifiedStyles}
        leftVirtualCellWidth={leftVirtualCellWidth}
        rightVirtualCellWidth={rightVirtualCellWidth}
        leftVirtualCellCount={leftVirtualCellCount}
        rightVirtualCellCount={rightVirtualCellCount}
      >
        {
          virtualCells.map(
            (_, index) => (
              // @ts-expect-error TS2786
              <VirtualCell
                key={index.toString()}
                width={VirtualCellDefaultProps.width}
                isHeaderCell={VirtualCellDefaultProps.isHeaderCell} />
            ),
          )
        }
      </Row>
    );
  }
}
VirtualRow.defaultProps = VirtualRowDefaultProps;
