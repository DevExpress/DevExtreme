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
import Page from './page';
import { PAGER_INFO_CLASS } from './info';
import NumberBox from '../number-box';
import messageLocalization from '../../localization/message';
import getElementComputedStyle from './get-computed-style';
import { calculateValuesFittedWidth } from './calculate-values-fitted-width';

const PAGER_INFO_TEXT_CLASS = `${PAGER_INFO_CLASS}  dx-info-text`;
const PAGER_PAGE_INDEX_CLASS = 'dx-page-index';
const LIGHT_PAGES_CLASS = 'dx-light-pages';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  valueChanged,
  width,
  value,
  pageIndexRef,
  props: { pageCount, pagesCountText, rtlEnabled },
}: SmallPages) => (
  <div className={LIGHT_PAGES_CLASS}>
    <div ref={pageIndexRef as never} className={PAGER_PAGE_INDEX_CLASS}>
      <NumberBox
        min={1}
        max={pageCount}
        width={width}
        value={value}
        rtlEnabled={rtlEnabled}
        valueChange={valueChanged}
      />
    </div>
    <span className={PAGER_INFO_TEXT_CLASS}>{pagesCountText}</span>
    <Page selected={false} index={(pageCount as number) - 1} />
  </div>
);

@ComponentBindings()
export class SmallPagesProps {
  @OneWay() pageCount?: number = 10;

  @OneWay() pageIndex?: number = 0;

  // tslint:disable-next-line: max-line-length
  @OneWay() pagesCountText?: string = messageLocalization.getFormatter('dxPager-pagesCountText')();

  @OneWay() rtlEnabled?: boolean = false;

  @Event() pageIndexChange?: (pageIndex: number) => void = () => { }; // commonUtils.noop
}

// tslint:disable-next-line: max-classes-per-file
@Component({ defaultOptionRules: null, view: viewFunction })
export default class SmallPages extends JSXComponent<SmallPagesProps> {
  @Ref() pageIndexRef!: HTMLDivElement;

  get value(): number {
    return (this.props.pageIndex as number) + 1;
  }

  get width(): number {
    return calculateValuesFittedWidth(this.minWidth, [this.props.pageCount as number]);
  }

  @InternalState() private minWidth = 10;

  @Effect() updateWidth(): void {
    const style = getElementComputedStyle(this.pageIndexRef);
    if (style) {
      this.minWidth = Number(style.minWidth.replace('px', ''));
    }
  }

  valueChanged(value: number): void {
    if (this.props.pageIndexChange) {
      this.props.pageIndexChange(value - 1);
    }
  }
}
