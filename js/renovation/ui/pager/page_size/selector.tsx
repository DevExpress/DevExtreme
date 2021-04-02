/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  ComponentBindings, JSXComponent, OneWay, Component, Ref, ForwardRef, Effect, RefObject,
} from '@devextreme-generator/declarations';

import { FullPageSize } from '../common/types.d';
import { PageSizeSmall } from './small';
import { PageSizeLarge } from './large';
import { PagerProps } from '../common/pager_props';
import messageLocalization from '../../../../localization/message';
import { PAGER_PAGE_SIZES_CLASS } from '../common/consts';

export const viewFunction = ({
  htmlRef,
  normalizedPageSizes,
  props: {
    isLargeDisplayMode, pageSize, pageSizeChange,
  },
}: PageSizeSelector): JSX.Element => (
  <div ref={htmlRef} className={PAGER_PAGE_SIZES_CLASS}>
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

  @ForwardRef() rootElementRef?: RefObject<HTMLDivElement>;
}
type PageSizeSelectorPropsType = Pick<PagerProps, 'pageSize'| 'pageSizeChange' | 'pageSizes' > & PageSizeSelectorProps;
@Component({ defaultOptionRules: null, view: viewFunction })
export class PageSizeSelector
  extends JSXComponent<PageSizeSelectorPropsType>() {
  @Ref() htmlRef!: RefObject<HTMLDivElement>;

  @Effect({ run: 'once' }) setRootElementRef(): void {
    const { rootElementRef } = this.props;
    if (rootElementRef) {
      rootElementRef.current = this.htmlRef.current;
    }
  }

  get normalizedPageSizes(): FullPageSize[] {
    const { pageSizes } = this.props;
    return pageSizes.map((p) => (((p === 'all' || p === 0) ? { text: getAllText(), value: 0 } : { text: String(p), value: p }) as FullPageSize));
  }
}
