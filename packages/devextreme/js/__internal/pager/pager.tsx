/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { InfernoEffect } from '@devextreme/runtime/inferno';
import { createReRenderEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';

import { combineClasses } from '../core/r1/utils/render_utils';
import type { PagerProps } from './common/pager_props';
import { PagerDefaultProps } from './common/pager_props';
import { PagerContent } from './content';
import { ResizableContainer } from './resizable_container';

export class Pager extends InfernoWrapperComponent<PagerProps> {
  public __getterCache = {};

  constructor(props) {
    super(props);
    this.pageIndexChangedInternal = this.pageIndexChangedInternal.bind(this);
    this.pageSizeChangedInternal = this.pageSizeChangedInternal.bind(this);
  }

  createEffects(): InfernoEffect[] {
    return [createReRenderEffect()];
  }

  pageIndexChangedInternal(newPageIndex: number): void {
    const newValue = this.props.gridCompatibility ? newPageIndex + 1 : newPageIndex;
    this.setState(() => ({
      pageIndex: newValue,
    }));
    this.props.pageIndexChangedInternal(newValue);
  }

  getPageIndex(): number {
    if (this.props.gridCompatibility) {
      return this.props.pageIndex - 1;
    }
    return this.props.pageIndex;
  }

  pageSizeChangedInternal(newPageSize: number): void {
    this.setState(() => ({
      pageSize: newPageSize,
    }));
    this.props.pageSizeChangedInternal(newPageSize);
  }

  getClassName(): string | undefined {
    if (this.props.gridCompatibility) {
      return combineClasses({
        'dx-datagrid-pager': true,
        [`${this.props.className}`]: !!this.props.className,
      });
    }
    return this.props.className;
  }

  getPagerProps(): PagerProps {
    return {
      ...this.props,
      className: this.getClassName(),
      pageIndex: this.getPageIndex(),
      // eslint-disable-next-line max-len
      pageIndexChangedInternal: (pageIndex: number): void => this.pageIndexChangedInternal(pageIndex),
      pageSizeChangedInternal: (pageSize: number): void => this.pageSizeChangedInternal(pageSize),
    };
  }

  render(): JSX.Element {
    return (
      <ResizableContainer
        contentTemplate={PagerContent}
        pagerProps={this.getPagerProps()}
      />
    );
  }
}
Pager.defaultProps = PagerDefaultProps;
