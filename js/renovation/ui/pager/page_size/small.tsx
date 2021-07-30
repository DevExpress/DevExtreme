import {
  ComponentBindings,
  JSXComponent,
  OneWay,
  InternalState,
  Effect,
  Component,
  Ref,
  RefObject,
} from '@devextreme-generator/declarations';

import { SelectBox } from '../../editors/drop_down_editors/select_box';
import { calculateValuesFittedWidth } from '../utils/calculate_values_fitted_width';
import { FullPageSize } from '../common/types.d';
import { getElementMinWidth } from '../utils/get_element_width';
import { InternalPagerProps } from '../common/internal_page_props';

export const viewFunction = ({
  width,
  props: {
    pageSize, pageSizeChange, pageSizes,
  },
}: PageSizeSmall): JSX.Element => (
  <SelectBox
    displayExpr="text"
    valueExpr="value"
    dataSource={pageSizes}
    value={pageSize}
    valueChange={pageSizeChange}
    width={width}
  />
);

type PageSizeSmallPropsType = Omit<InternalPagerProps, 'pageSizes'> & Pick<PageSizeSmallProps, 'parentRef' | 'pageSizes'>;

@ComponentBindings()
export class PageSizeSmallProps {
  @Ref() parentRef!: RefObject<HTMLElement>;

  @OneWay() pageSizes!: FullPageSize[];
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class PageSizeSmall
  extends JSXComponent<PageSizeSmallPropsType, 'pageSizeChange' | 'pageSize'>() {
  @InternalState() private minWidth = 10;

  get width(): number {
    return calculateValuesFittedWidth(
      this.minWidth,
      this.props.pageSizes.map((p) => p.value),
    );
  }

  @Effect({ run: 'always' }) updateWidth(): void {
    this.minWidth = getElementMinWidth(this.props.parentRef.current) || this.minWidth;
  }
}
