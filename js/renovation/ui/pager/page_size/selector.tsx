/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  ComponentBindings, JSXComponent, Event, TwoWay, OneWay, Component, Method, Ref,
} from 'devextreme-generator/component_declaration/common';

import { GetHtmlElement, FullPageSize } from '../common/types.d';
import { PageSizeSmall } from './small';
import { PageSizeLarge } from './large';

export const PAGER_PAGE_SIZES_CLASS = 'dx-page-sizes';

export const viewFunction = ({
  htmlRef,
  normalizedPageSizes,
  props: {
    isLargeDisplayMode, pageSize, pageSizeChange, rtlEnabled,
  },
}: PageSizeSelector) => (
  <div ref={htmlRef as never} className={PAGER_PAGE_SIZES_CLASS}>
    {isLargeDisplayMode && (
    <PageSizeLarge
      pageSizes={normalizedPageSizes}
      pageSize={pageSize}
      pageSizeChange={pageSizeChange}
    />
    )}
    {!isLargeDisplayMode && (
    <PageSizeSmall
      parentRef={htmlRef}
      rtlEnabled={rtlEnabled}
      pageSizes={normalizedPageSizes}
      pageSize={pageSize}
      pageSizeChange={pageSizeChange}
    />
    )}
  </div>
);

type PageSize = number;// | FullPageSize;
@ComponentBindings()
export class PageSizeSelectorProps {
  @OneWay() isLargeDisplayMode?: boolean = true;

  @TwoWay() pageSize?: number = 5;

  @OneWay() pageSizes?: PageSize[] = [5, 10];

  @OneWay() rtlEnabled?: boolean = false;

  @Event() pageSizeChange?: (pageSize: number) => void;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class PageSizeSelector
  extends JSXComponent(PageSizeSelectorProps)
  implements GetHtmlElement {
  @Ref() htmlRef!: HTMLDivElement;

  @Method() getHtmlElement(): HTMLElement {
    return this.htmlRef;
  }

  get normalizedPageSizes(): FullPageSize[] {
    const { pageSizes } = this.props as Required<PageSizeSelectorProps>;
    return pageSizes.map((p) => ({ text: String(p), value: p } as FullPageSize));
  }
}
