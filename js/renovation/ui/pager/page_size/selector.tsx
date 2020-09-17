/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  ComponentBindings, JSXComponent, OneWay, Component, Method, Ref,
} from 'devextreme-generator/component_declaration/common';

import { GetHtmlElement, FullPageSize } from '../common/types.d';
import { PageSizeSmall } from './small';
import { PageSizeLarge } from './large';
import PagerProps from '../common/pager_props';
import messageLocalization from '../../../../localization/message';
import { PAGER_PAGE_SIZES_CLASS } from '../common/consts';

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

function getAllText(): string {
  return messageLocalization.getFormatter('dxPager-pageSizesAllText')();
}
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
    return pageSizes.map((p) => (((p === 'all' || p === 0) ? { text: getAllText(), value: 0 } : { text: String(p), value: p }) as FullPageSize));
  }
}
