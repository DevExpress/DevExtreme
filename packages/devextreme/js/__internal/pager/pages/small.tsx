/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { InfernoComponent, InfernoEffect } from '@devextreme/runtime/inferno';
import type { RefObject } from 'inferno';
import { createRef } from 'inferno';

import { PagerDefaultProps, type PagerProps } from '../common/pager_props';
import { NumberBox } from '../editors/number_box';
import { PAGER_INFO_CLASS } from '../info';
import { calculateValuesFittedWidth } from '../utils/calculate_values_fitted_width';
import { getLocalizationMessage } from '../utils/compatibility_utils';
import { getElementMinWidth } from '../utils/get_element_width';
import { Page } from './page';

const PAGER_INFO_TEXT_CLASS = `${PAGER_INFO_CLASS}  dx-info-text`;
const PAGER_PAGE_INDEX_CLASS = 'dx-page-index';
const LIGHT_PAGES_CLASS = 'dx-light-pages';
const PAGER_PAGES_COUNT_CLASS = 'dx-pages-count';

// eslint-disable-next-line @typescript-eslint/no-type-alias
type PagerSmallPropsType = Pick<PagerProps, 'pageCount' | 'pageIndex' | 'pageIndexChangedInternal' | 'pagesCountText'>;

export const PagerSmallDefaultProps: PagerSmallPropsType = {
  pageIndex: PagerDefaultProps.pageIndex,
  pageCount: PagerDefaultProps.pageCount,
  pageIndexChangedInternal: PagerDefaultProps.pageIndexChangedInternal,
};

export class PagesSmall extends InfernoComponent<PagerSmallPropsType> {
  public state = {
    minWidth: 10,
  };

  public refs: any = null;

  private readonly pageIndexRef: RefObject<HTMLDivElement> = createRef();

  constructor(props) {
    super(props);
    this.updateWidth = this.updateWidth.bind(this);
    this.selectLastPageIndex = this.selectLastPageIndex.bind(this);
    this.valueChange = this.valueChange.bind(this);
  }

  componentWillUpdate(nextProps: PagerSmallPropsType, nextState, context): void {
    super.componentWillUpdate(nextProps, nextState, context);
  }

  createEffects(): InfernoEffect[] {
    return [new InfernoEffect(this.updateWidth, [this.state.minWidth])];
  }

  updateEffects(): void {
    this._effects[0]?.update([this.state.minWidth]);
  }

  updateWidth(): void {
    const el = this.pageIndexRef.current?.querySelector(`.${PAGER_PAGE_INDEX_CLASS}`);
    this.setState((state) => ({
      minWidth: (el && getElementMinWidth(el)) || state.minWidth,
    }));
  }

  getValue(): number {
    return this.props.pageIndex + 1;
  }

  getWidth(): number {
    return calculateValuesFittedWidth(this.state.minWidth, [this.props.pageCount]);
  }

  getPagesCountText(): string {
    return (this.props.pagesCountText ?? '') || getLocalizationMessage(this.context, 'dxPagination-pagesCountText');
  }

  getAriaPageNumberText(): string {
    return getLocalizationMessage(this.context, 'dxPagination-ariaPageNumber');
  }

  selectLastPageIndex(): void {
    this.props.pageIndexChangedInternal(this.props.pageCount - 1);
  }

  valueChange(value): void {
    this.props.pageIndexChangedInternal(value - 1);
  }

  render(): JSX.Element {
    return (
      <div className={LIGHT_PAGES_CLASS} ref={this.pageIndexRef}>
        <NumberBox
          className={PAGER_PAGE_INDEX_CLASS}
          min={1}
          max={Math.max(this.props.pageCount, this.getValue())}
          width={this.getWidth()}
          value={this.getValue()}
          valueChange={this.valueChange}
          inputAttr={{
            'aria-label': this.getAriaPageNumberText(),
          }}
        />
        <span className={PAGER_INFO_TEXT_CLASS}>{this.getPagesCountText()}</span>
        <Page
          className={PAGER_PAGES_COUNT_CLASS}
          selected={false}
          index={this.props.pageCount - 1}
          onClick={this.selectLastPageIndex}
        />
      </div>
    );
  }
}
PagesSmall.defaultProps = PagerSmallDefaultProps;
