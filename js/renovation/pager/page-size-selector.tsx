/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  Component, ComponentBindings, JSXComponent, Event, OneWay,
} from 'devextreme-generator/component_declaration/common';
import SelectBox, { SelectBoxProps } from '../select-box';
import LightButton from './light-button';

const PAGER_SELECTION_CLASS = 'dx-selection';
export const PAGER_PAGE_SIZES_CLASS = 'dx-page-sizes';
export const PAGER_PAGE_SIZE_CLASS = 'dx-page-size';
export const PAGER_SELECTED_PAGE_SIZE_CLASS = `${PAGER_PAGE_SIZE_CLASS} ${PAGER_SELECTION_CLASS}`;
export const viewFunction = ({
  pageSizesText, selectBoxProps,
  props: { isLargeDisplayMode },
}: PageSizeSelector) => {
  const {
    dataSource, rtlEnabled, value, valueChange, width,
  } = selectBoxProps;
  return (
    <div className={PAGER_PAGE_SIZES_CLASS}>
      {isLargeDisplayMode && pageSizesText.map(({
        text, className, label, click,
      }) => (
        <LightButton key={text} className={className} label={label} onClick={click}>
          {text}
        </LightButton>
      ))}
      {!isLargeDisplayMode && (
        <SelectBox
          displayExpr="text"
          valueExpr="value"
          dataSource={dataSource}
          rtlEnabled={rtlEnabled}
          value={value}
          valueChange={valueChange}
          width={width}
        />
      )}
    </div>
  );
};
type FullPageSize = { text: string; value: number };
type PageSize = number;// | FullPageSize;
@ComponentBindings()
export class PageSizeSelectorProps {
  @OneWay() isLargeDisplayMode?: boolean = true;

  @OneWay() pageSize?: number = 5;

  @OneWay() pageSizes?: PageSize[] = [5, 10];

  @OneWay() rtlEnabled?: boolean = false;

  @Event() pageSizeChanged?: (pageSize: number) => void = () => { }; // commonUtils.noop
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class PageSizeSelector extends JSXComponent<PageSizeSelectorProps> {
  get pageSizesText() {
    const { pageSize, rtlEnabled } = this.props;
    const normPageSizes = rtlEnabled
      ? [...this.normalizedPageSizes()].reverse()
      : this.normalizedPageSizes();
    return normPageSizes.map(({ value: processedPageSize, text }) => {
      const selected = processedPageSize === pageSize;
      const className = selected ? PAGER_SELECTED_PAGE_SIZE_CLASS : PAGER_PAGE_SIZE_CLASS;
      return {
        className,
        click: this.onPageSizeChanged(processedPageSize),
        label: `Display ${processedPageSize} items on page`,
        text,
      };
    });
  }

  get selectBoxProps(): SelectBoxProps {
    const { pageSize, rtlEnabled } = this.props;
    return {
      dataSource: this.normalizedPageSizes(),
      displayExpr: 'text',
      rtlEnabled,
      value: pageSize,
      valueChange: this.props.pageSizeChanged,
      valueExpr: 'value',
      width: this.calculateLightPageSizesWidth(),
    };
  }

  // tODO try to use flex
  private calculateLightPageSizesWidth() {
    // tslint:disable-next-line: max-line-length
    // return Number(this._$pagesSizeChooser.css('minWidth').replace('px', ''))
    const { pageSizes } = this.props;
    return 40 + 10 * Math.max(...pageSizes).toString().length;
  }

  private normalizedPageSizes(): FullPageSize[] {
    const { pageSizes } = this.props as Required<PageSizeSelectorProps>;
    return pageSizes.map((p) => ({ text: String(p), value: p } as FullPageSize));
  }

  private onPageSizeChanged(processedPageSize) {
    return () => {
      if (this.props.pageSizeChanged) {
        this.props.pageSizeChanged(processedPageSize);
      }
    };
  }
}
