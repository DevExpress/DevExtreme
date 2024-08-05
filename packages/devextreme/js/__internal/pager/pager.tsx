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
    this.pageIndexChange = this.pageIndexChange.bind(this);
    this.pageSizeChange = this.pageSizeChange.bind(this);
  }

  createEffects(): InfernoEffect[] {
    return [createReRenderEffect()];
  }

  pageIndexChange(newPageIndex: number): void {
    const newValue = this.props.gridCompatibility ? newPageIndex + 1 : newPageIndex;
    this.setState(() => ({
      pageIndex: newValue,
    }));
    this.props.pageIndexChange(newValue);
  }

  getPageIndex(): number {
    if (this.props.gridCompatibility) {
      return this.props.pageIndex - 1;
    }
    return this.props.pageIndex;
  }

  pageSizeChange(newPageSize: number): void {
    this.setState(() => ({
      pageSize: newPageSize,
    }));
    this.props.pageSizeChange(newPageSize);
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
      pageIndexChange: (pageIndex: number): void => this.pageIndexChange(pageIndex),
      pageSizeChange: (pageSize: number): void => this.pageSizeChange(pageSize),
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
