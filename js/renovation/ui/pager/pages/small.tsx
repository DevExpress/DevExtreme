import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Effect,
  InternalState, RefObject, Ref,
} from '@devextreme-generator/declarations';

import { Page } from './page';
import { PAGER_INFO_CLASS } from '../info';
import { NumberBox } from '../../editors/number_box';
import messageLocalization from '../../../../localization/message';
import { calculateValuesFittedWidth } from '../utils/calculate_values_fitted_width';
import { getElementMinWidth } from '../utils/get_element_width';
import { InternalPagerProps } from '../common/pager_props';

const PAGER_INFO_TEXT_CLASS = `${PAGER_INFO_CLASS}  dx-info-text`;
const PAGER_PAGE_INDEX_CLASS = 'dx-page-index';
const LIGHT_PAGES_CLASS = 'dx-light-pages';
const PAGER_PAGES_COUNT_CLASS = 'dx-pages-count';

export const viewFunction = ({
  pageIndexRef,
  selectLastPageIndex,
  valueChange,
  width,
  value,
  pagesCountText,
  props: { pageCount, inputAttr },
}: PagesSmall): JSX.Element => (
  <div className={LIGHT_PAGES_CLASS} ref={pageIndexRef}>
    <NumberBox
      className={PAGER_PAGE_INDEX_CLASS}
      min={1}
      max={pageCount}
      width={width}
      value={value}
      valueChange={valueChange}
      inputAttr={inputAttr}
    />
    <span className={PAGER_INFO_TEXT_CLASS}>{pagesCountText}</span>
    <Page
      className={PAGER_PAGES_COUNT_CLASS}
      selected={false}
      index={pageCount - 1}
      onClick={selectLastPageIndex}
    />
  </div>
);

@ComponentBindings()
export class PagerSmallProps {
  @OneWay() inputAttr = { 'aria-label': messageLocalization.format('dxPager-ariaPageNumber') };
}

// eslint-disable-next-line @typescript-eslint/no-type-alias
type PagerSmallPropsType = Pick<InternalPagerProps, 'pageCount' | 'pageIndex' | 'pageIndexChange' | 'pagesCountText'> & PagerSmallProps;

@Component({ defaultOptionRules: null, view: viewFunction })
export class PagesSmall extends JSXComponent<PagerSmallPropsType, 'pageIndexChange'>() {
  @Ref() pageIndexRef!: RefObject<HTMLDivElement>;

  get value(): number {
    return this.props.pageIndex + 1;
  }

  get width(): number {
    const { pageCount } = this.props;
    return calculateValuesFittedWidth(this.minWidth, [pageCount]);
  }

  get pagesCountText(): string {
    return (this.props.pagesCountText ?? '') || messageLocalization.getFormatter('dxPager-pagesCountText')();
  }

  @InternalState() private minWidth = 10;

  @Effect() updateWidth(): void {
    const el = this.pageIndexRef.current?.querySelector(`.${PAGER_PAGE_INDEX_CLASS}`);
    this.minWidth = (el && getElementMinWidth(el)) || this.minWidth;
  }

  selectLastPageIndex(): void {
    this.props.pageIndexChange(this.props.pageCount - 1);
  }

  valueChange(value: number): void {
    this.props.pageIndexChange(value - 1);
  }
}
