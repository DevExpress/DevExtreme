/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  ComponentBindings, JSXComponent, Event, OneWay, Component, Method, Ref,
} from 'devextreme-generator/component_declaration/common';
import LightButton from './light-button';
import type { GetHtmlElement } from './resizable-container';
import SmallPageSize from './small-page-size';

const PAGER_SELECTION_CLASS = 'dx-selection';
export const PAGER_PAGE_SIZES_CLASS = 'dx-page-sizes';
export const PAGER_PAGE_SIZE_CLASS = 'dx-page-size';
export const PAGER_SELECTED_PAGE_SIZE_CLASS = `${PAGER_PAGE_SIZE_CLASS} ${PAGER_SELECTION_CLASS}`;
export const viewFunction = ({
  pageSizesText, htmlRef, getHtmlElementWorkAround: getHtmlElement, normalizedPageSizes,
  props: {
    isLargeDisplayMode, pageSize, pageSizeChanged, rtlEnabled,
  },
}: PageSizeSelector) => (
  <div ref={htmlRef as never} className={PAGER_PAGE_SIZES_CLASS}>
    {isLargeDisplayMode && pageSizesText.map(({
      text, className, label, click,
    }) => (
      <LightButton key={text} className={className} label={label} onClick={click}>
        {text}
      </LightButton>
    ))}
    {!isLargeDisplayMode && (
      <SmallPageSize
        parentRef={getHtmlElement}
        rtlEnabled={rtlEnabled}
        pageSizes={normalizedPageSizes}
        pageSize={pageSize}
        pageSizeChanged={pageSizeChanged}
      />
    )}
  </div>
);
export type FullPageSize = { text: string; value: number };
type PageSize = number;// | FullPageSize;
@ComponentBindings()
export class PageSizeSelectorProps {
  @OneWay() isLargeDisplayMode?: boolean = true;

  @OneWay() pageSize?: number = 5;

  @OneWay() pageSizes?: PageSize[] = [5, 10];

  @OneWay() rtlEnabled?: boolean = false;

  @Event() pageSizeChanged!: (pageSize: number) => void; // commonUtils.noop
}

@Component({ defaultOptionRules: null, view: viewFunction })
export default class PageSizeSelector extends JSXComponent(PageSizeSelectorProps)
  implements GetHtmlElement {
  @Method() getHtmlElement(): HTMLElement {
    return this.htmlRef;
  }

  // TODO Vitik: bug in generator: Create same function because cannot use
  // getHtmlElement in viewFunction (it local and not exported)
  getHtmlElementWorkAround(): HTMLElement {
    return this.htmlRef;
  }

  @Ref() htmlRef!: HTMLDivElement;

  get pageSizesText() {
    const { pageSize } = this.props;
    return this.normalizedPageSizes.map(({ value: processedPageSize, text }) => {
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

  get normalizedPageSizes(): FullPageSize[] {
    const { pageSizes } = this.props as Required<PageSizeSelectorProps>;
    return pageSizes.map((p) => ({ text: String(p), value: p } as FullPageSize));
  }

  private onPageSizeChanged(processedPageSize: number) {
    return () => this.props.pageSizeChanged(processedPageSize);
  }
}
