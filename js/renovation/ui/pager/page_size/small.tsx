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
import { FullPageSize } from '../common/types';
import { getElementMinWidth } from '../utils/get_element_width';
import { InternalPagerProps } from '../common/pager_props';

const PAGER_PAGE_SIZE_SMALL_DESCRIPTION = 'Page size';

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
    inputAttr={ { 'aria-label': PAGER_PAGE_SIZE_SMALL_DESCRIPTION } }
  />
);

@ComponentBindings()
export class PageSizeSmallProps {
  @Ref() parentRef!: RefObject<HTMLElement>;

  @OneWay() pageSizes!: FullPageSize[];
}

// eslint-disable-next-line @typescript-eslint/no-type-alias
type PageSizeSmallPropsType = Pick<InternalPagerProps, 'pageSize' | 'pageSizeChange'> & PageSizeSmallProps;

@Component({ defaultOptionRules: null, view: viewFunction })
export class PageSizeSmall
  extends JSXComponent<PageSizeSmallPropsType, 'parentRef' | 'pageSizes' | 'pageSizeChange'>() {
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
