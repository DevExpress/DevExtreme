/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  ComponentBindings,
  JSXComponent,
  OneWay,
  Component,
  Fragment,
} from '@devextreme-generator/declarations';

import { combineClasses } from '../../../utils/combine_classes';
import { LightButton } from '../common/light_button';
import { FullPageSize } from '../common/types';
import { InternalPagerProps } from '../common/pager_props';
import { PAGER_SELECTED_PAGE_SIZE_CLASS, PAGER_PAGE_SIZE_CLASS } from '../common/consts';

export const viewFunction = ({ pageSizesText }: PageSizeLarge): JSX.Element => (
  <Fragment>
    {
        pageSizesText.map(({
          text, className, label, click,
        }) => (
          <LightButton key={text} className={className} label={label} onClick={click}>
            {text}
          </LightButton>
        ))
    }
  </Fragment>
);
@ComponentBindings()
export class PageSizeLargeProps {
  @OneWay() pageSizes!: FullPageSize[];
}

// eslint-disable-next-line @typescript-eslint/no-type-alias
type PageSizeLargePropsType = Pick<InternalPagerProps, 'pageSize' | 'pageSizeChange'> & PageSizeLargeProps;

@Component({ defaultOptionRules: null, view: viewFunction })
export class PageSizeLarge extends JSXComponent<PageSizeLargePropsType, 'pageSizes' | 'pageSizeChange'>() {
  get pageSizesText(): {
    className: string;
    click: () => void;
    label: string;
    text: string;
  }[] {
    const { pageSize, pageSizes } = this.props;
    return pageSizes.map(({ value: processedPageSize, text }) => {
      const selected = processedPageSize === pageSize;
      const className = combineClasses({
        [selected ? PAGER_SELECTED_PAGE_SIZE_CLASS : PAGER_PAGE_SIZE_CLASS]: true,
      });
      return {
        className,
        click: this.onPageSizeChange(processedPageSize),
        label: `Display ${processedPageSize} items on page`,
        text,
      };
    });
  }

  private onPageSizeChange(processedPageSize: number) {
    return () => {
      this.props.pageSizeChange(processedPageSize);
      return this.props.pageSize;
    };
  }
}
