/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  ComponentBindings, JSXComponent, Event, OneWay, InternalState, Effect, Component,
} from 'devextreme-generator/component_declaration/common';
import SelectBox from '../select-box';
import getElementComputedStyle from './get-computed-style';
import { calculateValuesFittedWidth } from './calculate-values-fitted-width';
// bug in generator import type { FullPageSize } from './page-size-selector';

const PAGER_SELECTION_CLASS = 'dx-selection';
export const PAGER_PAGE_SIZES_CLASS = 'dx-page-sizes';
export const PAGER_PAGE_SIZE_CLASS = 'dx-page-size';
export const PAGER_SELECTED_PAGE_SIZE_CLASS = `${PAGER_PAGE_SIZE_CLASS} ${PAGER_SELECTION_CLASS}`;
export const viewFunction = ({
  width,
  props: {
    rtlEnabled, pageSize, pageSizeChanged, pageSizes,
  },
}: SmallPageSize) => (
  <SelectBox
    displayExpr="text"
    valueExpr="value"
    dataSource={pageSizes}
    rtlEnabled={rtlEnabled}
    value={pageSize}
    valueChange={pageSizeChanged}
    width={width}
  />
);
type FullPageSize = { text: string; value: number };
// type PageSize = number;// | FullPageSize;
@ComponentBindings()
export class SmallPageSizeProps {
  @OneWay() parentRef!: () => HTMLElement;

  @OneWay() pageSize?: number = 5;

  @OneWay() pageSizes!: FullPageSize[];

  @OneWay() rtlEnabled?: boolean = false;

  @Event() pageSizeChanged!: (pageSize: number) => void;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export default class SmallPageSize extends JSXComponent<SmallPageSizeProps> {
  @InternalState() private minWidth = 10;

  get width() {
    return calculateValuesFittedWidth(this.minWidth, this.props.pageSizes.map((p) => p.value));
  }

  @Effect() updateWidth(): void {
    const style = getElementComputedStyle(this.props.parentRef());
    if (style) {
      this.minWidth = Number(style.minWidth.replace('px', ''));
    }
  }
}
