/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  ComponentBindings, JSXComponent, OneWay, Component, Method, Ref,
} from 'devextreme-generator/component_declaration/common';

import { GetHtmlElement, FullPageSize } from '../common/types.d';
import { PageSizeSmall } from './small';
import { PageSizeLarge } from './large';
import PagerProps from '../common/pager_props';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { EventCallback } from '../../common/event_callback.d';

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
/* istanbul ignore next: class has only props default */
@ComponentBindings()
class PageSizeSelectorProps {
  @OneWay() isLargeDisplayMode = true;
}
type PageSizeSelectorPropsType = Pick<PagerProps, 'pageSize'| 'pageSizeChange' | 'pageSizes' | 'rtlEnabled'> & PageSizeSelectorProps;
@Component({ defaultOptionRules: null, view: viewFunction })
export class PageSizeSelector
  extends JSXComponent<PageSizeSelectorPropsType>()
  implements GetHtmlElement {
  @Ref() htmlRef!: HTMLDivElement;

  @Method() getHtmlElement(): HTMLElement {
    return this.htmlRef;
  }

  get normalizedPageSizes(): FullPageSize[] {
    const { pageSizes } = this.props;
    return pageSizes.map((p) => ({ text: String(p), value: p } as FullPageSize));
  }
}
