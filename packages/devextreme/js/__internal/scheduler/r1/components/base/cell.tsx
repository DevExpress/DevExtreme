import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import type { PropsWithChildren, PropsWithClassName } from '@ts/core/r1/index';

import { renderUtils } from '../../utils/index';
import type { ContentTemplateProps, DefaultProps, PropsWithViewContext } from '../types';

export interface CellBaseProps extends PropsWithClassName,
  PropsWithChildren,
  PropsWithViewContext {
  isFirstGroupCell?: boolean;
  isLastGroupCell?: boolean;
  startDate: Date;
  endDate: Date;
  allDay?: boolean;
  groups?: Record<string, unknown>;
  groupIndex?: number;
  text?: string;
  index: number;
  contentTemplateProps?: ContentTemplateProps;
  ariaLabel?: string;
}

export const CellBaseDefaultProps: DefaultProps<CellBaseProps> = {
  className: '',
  isFirstGroupCell: false,
  isLastGroupCell: false,
  startDate: new Date(),
  endDate: new Date(),
  allDay: false,
  text: '',
  index: 0,
  contentTemplateProps: {
    data: {},
    index: 0,
  },
};

export class CellBase extends BaseInfernoComponent<CellBaseProps> {
  render(): JSX.Element {
    const {
      className,
      isFirstGroupCell,
      isLastGroupCell,
      children,
      ariaLabel,
    } = this.props;

    const classes = renderUtils
      .getGroupCellClasses(isFirstGroupCell, isLastGroupCell, className);

    return (
      <td
        className={classes}
        aria-label={ariaLabel}
      >
        {children}
      </td>
    );
  }
}

CellBase.defaultProps = CellBaseDefaultProps;
