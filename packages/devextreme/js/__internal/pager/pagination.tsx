/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { InfernoEffect } from '@devextreme/runtime/inferno';
import { createReRenderEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';

import { combineClasses } from '../core/r1/utils/render_utils';
import type { PaginationProps } from './common/pagination_props';
import { PaginationDefaultProps } from './common/pagination_props';
import { PaginationContent } from './content';
import { ResizableContainer } from './resizable_container';
import { isGridCompatibilityMode } from './utils/compatibility_utils';

export class Pagination extends InfernoWrapperComponent<PaginationProps> {
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
    const newValue = newPageIndex + 1;
    this.setState(() => ({
      pageIndex: newValue,
    }));
    this.props.pageIndexChangedInternal(newValue);
  }

  getPageIndex(): number {
    return this.props.pageIndex - 1;
  }

  pageSizeChangedInternal(newPageSize: number): void {
    this.setState(() => ({
      pageSize: newPageSize,
    }));
    this.props.pageSizeChangedInternal(newPageSize);
  }

  getClassName(): string | undefined {
    return combineClasses({
      'dx-datagrid-pager': isGridCompatibilityMode(this.context),
      [`${this.props.className}`]: !!this.props.className,
    });
  }

  getPaginationProps(): PaginationProps {
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
        contentTemplate={PaginationContent}
        paginationProps={this.getPaginationProps()}
      />
    );
  }
}
Pagination.defaultProps = PaginationDefaultProps;
