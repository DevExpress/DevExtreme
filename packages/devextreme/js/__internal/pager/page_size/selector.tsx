/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { InfernoComponent, InfernoEffect } from '@devextreme/runtime/inferno';
import type { RefObject } from '@devextreme-generator/declarations';
import { createRef as infernoCreateRef } from 'inferno';

import messageLocalization from '../../../localization/message';
import { PAGER_PAGE_SIZES_CLASS } from '../common/consts';
import type { PagerProps } from '../common/pager_props';
import { PagerDefaultProps } from '../common/pager_props';
import type { FullPageSize } from '../common/types';
import { PageSizeLarge } from './large';
import { PageSizeSmall } from './small';

function getAllText(): string {
  return messageLocalization.getFormatter('dxPager-pageSizesAllText')();
}

export interface PageSizeSelectorProps {
  isLargeDisplayMode: boolean;
  rootElementRef?: RefObject<HTMLDivElement>;
}

// eslint-disable-next-line @typescript-eslint/no-type-alias
type PageSizeSelectorPropsType = Pick<PagerProps, 'pageSize' | 'pageSizeChange' | 'pageSizes' > & PageSizeSelectorProps;

const PageSizeSelectorDefaultProps: PageSizeSelectorPropsType = {
  isLargeDisplayMode: true,
  pageSize: PagerDefaultProps.pageSize,
  pageSizeChange: PagerDefaultProps.pageSizeChange,
  pageSizes: PagerDefaultProps.pageSizes,
};

export class PageSizeSelector extends InfernoComponent<PageSizeSelectorPropsType> {
  public state: any = {};

  public refs: any = null;

  public rootElementRef = infernoCreateRef() as RefObject<HTMLDivElement>;

  public htmlRef = infernoCreateRef() as RefObject<HTMLElement>;

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

  getNormalizedPageSizes(): FullPageSize[] {
    if (this.__getterCache.normalizedPageSizes !== undefined) {
      return this.__getterCache.normalizedPageSizes;
    }
    const mapFunction = (p): FullPageSize => (p === 'all' || p === 0 ? {
      text: getAllText(),
      value: 0,
    } : {
      text: String(p),
      value: p,
    });
    const result: FullPageSize[] | undefined = this.props.pageSizes.map<FullPageSize>(mapFunction);
    this.__getterCache.normalizedPageSizes = result;
    return result;
  }

  componentWillUpdate(nextProps: PageSizeSelectorPropsType) {
    super.componentWillUpdate();
    if (this.props.pageSizes !== nextProps.pageSizes) {
      this.__getterCache.normalizedPageSizes = undefined;
    }
  }

  render(): JSX.Element {
    const normalizedPageSizes = this.getNormalizedPageSizes();
    const {
      pageSize,
      pageSizeChange,
      isLargeDisplayMode,
    } = this.props;
    return (
      <div ref={this.htmlRef} className={PAGER_PAGE_SIZES_CLASS}>
        {isLargeDisplayMode && (
        <PageSizeLarge
          pageSizes={this.getNormalizedPageSizes()}
          pageSize={pageSize}
          pageSizeChange={pageSizeChange}
        />
        )}
        {!isLargeDisplayMode && (
        <PageSizeSmall
          parentRef={this.htmlRef}
          pageSizes={normalizedPageSizes}
          pageSize={pageSize}
          pageSizeChange={pageSizeChange}
        />
        )}
      </div>
    );
  }
}
PageSizeSelector.defaultProps = PageSizeSelectorDefaultProps;
