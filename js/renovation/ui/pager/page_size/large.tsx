/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  ComponentBindings, JSXComponent, TwoWay, OneWay, Component, Fragment, Event,
} from 'devextreme-generator/component_declaration/common';

import { LightButton } from '../common/light_button';
import { FullPageSize } from '../common/types.d';
import { PAGER_SELECTION_CLASS } from '../common/consts';

export const PAGER_PAGE_SIZE_CLASS = 'dx-page-size';
export const PAGER_SELECTED_PAGE_SIZE_CLASS = `${PAGER_PAGE_SIZE_CLASS} ${PAGER_SELECTION_CLASS}`;

export const viewFunction = ({ pageSizesText }: PageSizeLarge) => (
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
  @TwoWay() pageSize?: number = 5;

  @OneWay() pageSizes!: FullPageSize[];

  @Event() pageSizeChange?: (pageSize: number) => void; // commonUtils.noop
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class PageSizeLarge extends JSXComponent<PageSizeLargeProps, 'pageSizes'>() {
  get pageSizesText() {
    const { pageSize, pageSizes } = this.props;
    return pageSizes.map(({ value: processedPageSize, text }) => {
      const selected = processedPageSize === pageSize;
      const className = selected ? PAGER_SELECTED_PAGE_SIZE_CLASS : PAGER_PAGE_SIZE_CLASS;
      return {
        className,
        click: this.onPageSizeChange(processedPageSize),
        label: `Display ${processedPageSize} items on page`,
        text,
      };
    });
  }

  private onPageSizeChange(processedPageSize: number) {
    return () => { this.props.pageSize = processedPageSize; };
  }
}
