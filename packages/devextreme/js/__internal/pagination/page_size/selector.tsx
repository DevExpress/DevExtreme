/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { InfernoComponent, InfernoEffect } from '@devextreme/runtime/inferno';
import type { RefObject } from '@ts/core/r1/types';
import { createRef as infernoCreateRef } from 'inferno';

import { PAGINATION_PAGE_SIZES_CLASS } from '../common/consts';
import type { PaginationProps } from '../common/pagination_props';
import { PaginationDefaultProps } from '../common/pagination_props';
import type { FullPageSize } from '../common/types';
import { getLocalizationMessage } from '../utils/compatibility_utils';
import { PageSizeLarge } from './large';
import { PageSizeSmall } from './small';

export interface PageSizeSelectorProps {
  isLargeDisplayMode: boolean;
  rootElementRef?: RefObject<HTMLDivElement>;
}

// eslint-disable-next-line @typescript-eslint/no-type-alias
type PageSizeSelectorPropsType = Pick<PaginationProps, 'pageSize' | 'pageSizeChangedInternal' | 'allowedPageSizes' > & PageSizeSelectorProps;

const PageSizeSelectorDefaultProps: PageSizeSelectorPropsType = {
  isLargeDisplayMode: true,
  pageSize: PaginationDefaultProps.pageSize,
  pageSizeChangedInternal: PaginationDefaultProps.pageSizeChangedInternal,
  allowedPageSizes: PaginationDefaultProps.allowedPageSizes,
};

export class PageSizeSelector extends InfernoComponent<PageSizeSelectorPropsType> {
  public state: any = {};

  public refs: any = null;

  public rootElementRef = infernoCreateRef() as RefObject<HTMLDivElement>;

  public htmlRef = infernoCreateRef() as RefObject<HTMLDivElement>;

  public __getterCache: any = {
    normalizedPageSizes: undefined,
  };

  constructor(props) {
    super(props);
    this.setRootElementRef = this.setRootElementRef.bind(this);
  }

  createEffects(): InfernoEffect[] {
    return [new InfernoEffect(this.setRootElementRef, [])];
  }

  setRootElementRef(): void {
    const {
      rootElementRef,
    } = this.props;
    if (rootElementRef) {
      rootElementRef.current = this.htmlRef.current as HTMLDivElement;
    }
  }

  getAllText(): string {
    return getLocalizationMessage(this.context, 'dxPagination-pageSizesAllText');
  }

  getNormalizedPageSizes(): FullPageSize[] {
    if (this.__getterCache.normalizedPageSizes !== undefined) {
      return this.__getterCache.normalizedPageSizes;
    }
    const mapFunction = (p): FullPageSize => (p === 'all' || p === 0 ? {
      text: this.getAllText(),
      value: 0,
    } : {
      text: String(p),
      value: p,
    });
    // eslint-disable-next-line max-len
    const result: FullPageSize[] | undefined = this.props.allowedPageSizes.map<FullPageSize>(mapFunction);
    this.__getterCache.normalizedPageSizes = result;
    return result;
  }

  componentWillUpdate(nextProps: PageSizeSelectorPropsType) {
    super.componentWillUpdate();
    if (this.props.allowedPageSizes !== nextProps.allowedPageSizes) {
      this.__getterCache.normalizedPageSizes = undefined;
    }
  }

  render(): JSX.Element {
    const normalizedPageSizes = this.getNormalizedPageSizes();
    const {
      pageSize,
      pageSizeChangedInternal,
      isLargeDisplayMode,
    } = this.props;
    return (
      <div ref={this.htmlRef} className={PAGINATION_PAGE_SIZES_CLASS}>
        {isLargeDisplayMode && (
        <PageSizeLarge
          allowedPageSizes={this.getNormalizedPageSizes()}
          pageSize={pageSize}
          pageSizeChangedInternal={pageSizeChangedInternal}
        />
        )}
        {!isLargeDisplayMode && (
        <PageSizeSmall
          parentRef={this.htmlRef}
          allowedPageSizes={normalizedPageSizes}
          pageSize={pageSize}
          pageSizeChangedInternal={pageSizeChangedInternal}
        />
        )}
      </div>
    );
  }
}
PageSizeSelector.defaultProps = PageSizeSelectorDefaultProps;
