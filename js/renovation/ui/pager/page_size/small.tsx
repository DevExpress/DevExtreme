import {
  ComponentBindings, JSXComponent, Event, OneWay, TwoWay, InternalState, Effect, Component, Ref,
} from 'devextreme-generator/component_declaration/common';

import { SelectBox } from '../../select_box';
import { calculateValuesFittedWidth } from '../utils/calculate_values_fitted_width';
import { FullPageSize } from '../common/types.d';
import { PAGER_SELECTION_CLASS } from '../common/consts';
import { getElementMinWidth } from '../utils/get_element_width';

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
  @Ref() parentRef!: HTMLElement;

  @TwoWay() pageSize?: number = 5;

  @OneWay() pageSizes!: FullPageSize[];

  @OneWay() rtlEnabled?: boolean = false;

  @Event() pageSizeChange?: (pageSize: number) => void;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class PageSizeSmall extends JSXComponent<PageSizeSmallProps, 'parentRef'|'pageSizes'|'pageSizeChange'>() {
  @InternalState() private minWidth = 10;

  get width(): number {
    return calculateValuesFittedWidth(this.minWidth, this.props.pageSizes.map((p) => p.value));
  }

  @Effect() updateWidth(): void {
    this.minWidth = getElementMinWidth(this.props.parentRef) || this.minWidth;
  }
}
