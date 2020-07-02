import {
  Component,
  ComponentBindings,
  JSXComponent,
  Event,
  OneWay,
  Effect,
  Ref,
  InternalState,
} from 'devextreme-generator/component_declaration/common';

import { Page } from './page';
import { PAGER_INFO_CLASS } from './info';
import { NumberBox } from '../number-box';
import messageLocalization from '../../localization/message';
import { calculateValuesFittedWidth } from './calculate-values-fitted-width';
import { getElementMinWidth } from './utils/get-element-width';

const PAGER_INFO_TEXT_CLASS = `${PAGER_INFO_CLASS}  dx-info-text`;
const PAGER_PAGE_INDEX_CLASS = 'dx-page-index';
const LIGHT_PAGES_CLASS = 'dx-light-pages';
const PAGER_PAGES_COUNT_CLASS = 'dx-pages-count';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  pageIndexRef,
  selectLastPageIndex,
  valueChange,
  width,
  value,
  props: { pageCount, pagesCountText, rtlEnabled },
}: PagesSmall) => (
  <div className={LIGHT_PAGES_CLASS}>
    <NumberBox
      ref={pageIndexRef as never}
      className={PAGER_PAGE_INDEX_CLASS}
      min={1}
      max={pageCount}
      width={width}
      value={value}
      rtlEnabled={rtlEnabled}
      valueChange={valueChange}
    />
    <span className={PAGER_INFO_TEXT_CLASS}>{pagesCountText}</span>
    <Page
      className={PAGER_PAGES_COUNT_CLASS}
      selected={false}
      index={(pageCount as number) - 1}
      onClick={selectLastPageIndex}
    />
  </div>
);

@ComponentBindings()
export class PagesSmallProps {
  @OneWay() pageCount?: number = 10;

  @OneWay() pageIndex?: number = 0;

  // tslint:disable-next-line: max-line-length
  @OneWay() pagesCountText?: string = messageLocalization.getFormatter('dxPager-pagesCountText')();

  @OneWay() rtlEnabled?: boolean = false;

  @Event() pageIndexChange?: (pageIndex: number) => void = () => { }; // commonUtils.noop
}

// tslint:disable-next-line: max-classes-per-file
@Component({ defaultOptionRules: null, view: viewFunction })
export class PagesSmall extends JSXComponent(PagesSmallProps) {
  @Ref() pageIndexRef!: NumberBox;

  get value(): number {
    return (this.props.pageIndex as number) + 1;
  }

  get width(): number {
    const pageCount = this.props.pageCount as number;
    return calculateValuesFittedWidth(this.minWidth, [pageCount]);
  }

  @InternalState() private minWidth = 10;

  @Effect() updateWidth(): void {
    this.minWidth = getElementMinWidth(this.pageIndexRef.getHtmlElement()) || this.minWidth;
  }

  selectLastPageIndex(): void {
    const { pageCount } = this.props as Required<PagesSmallProps>;
    this.props.pageIndexChange?.(pageCount - 1);
  }

  valueChange(value: number): void {
      this.props.pageIndexChange?.(value - 1);
  }
}
