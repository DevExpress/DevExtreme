import {
  ComponentBindings, JSXComponent, Event, OneWay, InternalState, Effect, Component, Ref,
} from 'devextreme-generator/component_declaration/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import SelectBox from '../select-box';
import { calculateValuesFittedWidth } from './calculate-values-fitted-width';
import { FullPageSize } from './pager.types.d';
import { PAGER_SELECTION_CLASS } from './consts';
import { getElementMinWidth } from './utils/get-element-width';

export const PAGER_PAGE_SIZES_CLASS = 'dx-page-sizes';
export const PAGER_PAGE_SIZE_CLASS = 'dx-page-size';
export const PAGER_SELECTED_PAGE_SIZE_CLASS = `${PAGER_PAGE_SIZE_CLASS} ${PAGER_SELECTION_CLASS}`;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  width,
  props: {
    rtlEnabled, pageSize, pageSizeChange, pageSizes,
  },
}: PageSizeSmall) => (
  <SelectBox
    displayExpr="text"
    valueExpr="value"
    dataSource={pageSizes}
    rtlEnabled={rtlEnabled}
    value={pageSize}
    valueChange={pageSizeChange}
    width={width}
  />
);

@ComponentBindings()
export class PageSizeSmallProps {
// Vitik: bug in generator replacce to @Ref() parentRef!: HTMLElement;
  @Ref() parentRef: HTMLElement | undefined;

  @OneWay() pageSize?: number = 5;

  @OneWay() pageSizes!: FullPageSize[];

  @OneWay() rtlEnabled?: boolean = false;

  @Event() pageSizeChange!: (pageSize: number) => void;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export default class PageSizeSmall extends JSXComponent(PageSizeSmallProps) {
  @InternalState() private minWidth = 10;

  get width(): number {
    return calculateValuesFittedWidth(this.minWidth, this.props.pageSizes.map((p) => p.value));
  }

  @Effect() updateWidth(): void {
    this.minWidth = getElementMinWidth(this.props.parentRef) || this.minWidth;
  }
}
