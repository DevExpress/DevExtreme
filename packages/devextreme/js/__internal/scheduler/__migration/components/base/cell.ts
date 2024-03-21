import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import type { PropsWithChildren, PropsWithClassName } from '@ts/core/component_wrappers/index';
import type { VNode } from 'inferno';
import { createVNode } from 'inferno';

import { renderUtils } from '../../utils/index';
import type { ContentTemplateProps } from '../types';

export interface CellBaseProps extends PropsWithClassName,
  PropsWithChildren {
  isFirstGroupCell?: boolean;
  isLastGroupCell?: boolean;
  startDate: Date;
  endDate: Date;
  allDay?: boolean;
  groups?: Record<string, unknown>;
  groupIndex?: number;
  text?: string;
  index: number;
  contentTemplateProps: ContentTemplateProps;
  ariaLabel?: string;
}

export const CellBaseDefaultProps: CellBaseProps = {
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
  render(): VNode {
    const {
      className,
      isFirstGroupCell,
      isLastGroupCell,
      children,
      ariaLabel,
    } = this.props;

    const classNames = renderUtils
      .getGroupCellClasses(isFirstGroupCell, isLastGroupCell, className);

    return createVNode(1, 'td', classNames, children, 0, {
      'aria-label': ariaLabel,
    });
  }
}

CellBase.defaultProps = CellBaseDefaultProps;
