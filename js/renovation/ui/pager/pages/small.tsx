import {
  Component,
  JSXComponent,
  Effect,
  InternalState, ForwardRef,
} from 'devextreme-generator/component_declaration/common';

import { Page } from './page';
import { PAGER_INFO_CLASS } from '../info';
import { NumberBox } from '../../number_box';
import messageLocalization from '../../../../localization/message';
import { calculateValuesFittedWidth } from '../utils/calculate_values_fitted_width';
import { getElementMinWidth } from '../utils/get_element_width';
import PagerProps from '../common/pager_props';

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
  pagesCountText,
  props: { pageCount },
}: PagesSmall) => (
  <div className={LIGHT_PAGES_CLASS}>
    <NumberBox
      rootElementRef={pageIndexRef}
      className={PAGER_PAGE_INDEX_CLASS}
      min={1}
      max={pageCount}
      width={width}
      value={value}
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

type PagesSmallPropsType = Pick<PagerProps,
'pageCount' | 'pageIndex' | 'pageIndexChange' | 'pagesCountText' >;

@Component({ defaultOptionRules: null, view: viewFunction })
export class PagesSmall extends JSXComponent<PagesSmallPropsType>() {
  @ForwardRef() pageIndexRef!: HTMLDivElement;

  get value(): number {
    return this.props.pageIndex + 1;
  }

  get width(): number {
    const pageCount = this.props.pageCount as number;
    return calculateValuesFittedWidth(this.minWidth, [pageCount]);
  }

  get pagesCountText(): string {
    return this.props.pagesCountText || messageLocalization.getFormatter('dxPager-pagesCountText')();
  }

  @InternalState() private minWidth = 10;

  @Effect() updateWidth(): void {
    this.minWidth = getElementMinWidth(this.pageIndexRef) || this.minWidth;
  }

  selectLastPageIndex(): void {
    const { pageCount } = this.props;
    this.props.pageIndexChange?.(pageCount - 1);
  }

  valueChange(value: number): void {
    this.props.pageIndex = value - 1;
  }
}
