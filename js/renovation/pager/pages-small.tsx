import {
  Component,
  ComponentBindings,
  JSXComponent,
  Event,
  OneWay,
  Effect,
} from 'devextreme-generator/component_declaration/common';
import Page from './page';
import { PAGER_INFO_CLASS } from './info';
import NumberBox from '../number-box';
import * as messageLocalization from '../../localization/message';

const PAGER_INFO_TEXT_CLASS = `${PAGER_INFO_CLASS}  dx-info-text`;
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  valueChanged,
  width,
  value,
  props: { pageCount, pagesCountText, rtlEnabled },
}: SmallPages) => (
  <div className="dx-light-pages">
    <NumberBox
      min={1}
      max={pageCount}
      width={width}
      value={value}
      rtlEnabled={rtlEnabled}
      valueChange={valueChanged}
    />
    <span className={PAGER_INFO_TEXT_CLASS}>{pagesCountText}</span>
    <Page selected={false} index={(pageCount as number) - 1} />
  </div>
);

type MessageLocalizationType = { getFormatter: (name: string) => (() => string) };
@ComponentBindings()
export class SmallPagesProps {
  @OneWay() pageCount?: number = 10;

  @OneWay() pageIndex?: number = 0;

  // tslint:disable-next-line: max-line-length
  @OneWay() pagesCountText?: string = (messageLocalization as MessageLocalizationType).getFormatter('dxPager-pagesCountText')();

  @OneWay() rtlEnabled?: boolean = false;

  @Event() pageIndexChange?: (pageIndex: number) => void = () => { }; // commonUtils.noop
}
export const oneDigitWidth = 10;

// tslint:disable-next-line: max-classes-per-file
@Component({ defaultOptionRules: null, view: viewFunction })
export default class SmallPages extends JSXComponent<SmallPagesProps> {
  get value(): number {
    return (this.props.pageIndex as number) + 1;
  }

  get width(): number {
    return this.minWidth + oneDigitWidth * (this.props.pageCount as number).toString().length;
  }

  private minWidth = 40;

  @Effect() updateWidth(): void {
    // TODO /*Number($pageIndex.css('minWidth').replace('px', ''))
    this.minWidth = 10;
  }

  valueChanged(value: number): void {
    if (this.props.pageIndexChange) {
      this.props.pageIndexChange(value - 1);
    }
  }
}
