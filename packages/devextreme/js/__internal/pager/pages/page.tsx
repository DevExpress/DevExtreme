/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';

import { format } from '../../../core/utils/string';
import type { EventCallback } from '../../core/r1/event_callback';
import { combineClasses } from '../../core/r1/utils/render_utils';
import { PAGINATION_PAGE_CLASS, PAGINATION_SELECTION_CLASS } from '../common/consts';
import { LightButton } from '../common/light_button';
import { getLocalizationMessage } from '../utils/compatibility_utils';

// for angular type inference (onClick type in angular changes to EventEmitter)
export interface PagePropsInterface {
  index: number;
  onClick?: EventCallback;
  selected?: boolean;
  className?: string;
}
/* istanbul ignore next: class has only props default */
export const PageDefaultProps: PagePropsInterface = {
  index: 0,
  selected: false,
  className: PAGINATION_PAGE_CLASS,
};

export class Page extends BaseInfernoComponent<PagePropsInterface> {
  public state: any = {};

  public refs: any = null;

  getLabel(): string {
    return format(getLocalizationMessage(this.context, 'dxPagination-page'), this.getValue()) as string;
  }

  getValue(): number {
    return this.props.index + 1;
  }

  getClassName(): string {
    return combineClasses({
      [`${this.props.className}`]: !!this.props.className,
      [PAGINATION_SELECTION_CLASS]: !!this.props.selected,
    });
  }

  render(): JSX.Element {
    return (
      <LightButton
        className={this.getClassName()}
        label={this.getLabel()}
        onClick={this.props.onClick}
        selected={this.props.selected}
      >
        {this.getValue()}
      </LightButton>
    );
  }
}
Page.defaultProps = PageDefaultProps;
