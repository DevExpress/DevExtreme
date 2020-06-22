/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  ComponentBindings, JSXComponent, Event, OneWay, Component, Method, Ref,
} from 'devextreme-generator/component_declaration/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import type { GetHtmlElement } from './pager.types';
import PageSizeSmall from './page-size-small';
import PageSizeLarge from './page-size-large';
import { FullPageSize } from './pager.types';

export const PAGER_PAGE_SIZES_CLASS = 'dx-page-sizes';

export const viewFunction = ({
  htmlRef,
  visible,
  normalizedPageSizes,
  props: {
    isLargeDisplayMode, pageSize, pageSizeChange, rtlEnabled,
  },
}: PageSizeSelector) => (!visible ? null : (
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
));

type PageSize = number;// | FullPageSize;
@ComponentBindings()
export class PageSizeSelectorProps {
  @OneWay() visible?: boolean = true;

  @OneWay() isLargeDisplayMode?: boolean = true;

  @OneWay() pageSize?: number = 5;

  @OneWay() pageSizes?: PageSize[] = [5, 10];

  @OneWay() rtlEnabled?: boolean = false;

  @Event() pageSizeChange!: (pageSize: number) => void; // commonUtils.noop
}

@Component({ defaultOptionRules: null, view: viewFunction })
export default class PageSizeSelector
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
