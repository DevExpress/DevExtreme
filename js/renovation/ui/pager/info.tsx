import {
  Component, ComponentBindings, JSXComponent, OneWay, TwoWay, Method, Ref,
} from 'devextreme-generator/component_declaration/common';

import { format } from '../../../core/utils/string';
import { GetHtmlElement } from './common/types.d';

export const PAGER_INFO_CLASS = 'dx-info';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({ text, htmlRef }: InfoText) => (
  <div ref={htmlRef as any} className={PAGER_INFO_CLASS}>
    {text}
  </div>
);

@ComponentBindings()
export class InfoTextProps {
  @OneWay() infoText?: string = '';

  @OneWay() pageCount?: number = 10;

  @TwoWay() pageIndex?: number = 0;

  @OneWay() totalCount?: number = 0;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class InfoText extends JSXComponent(InfoTextProps) implements GetHtmlElement {
  @Ref() htmlRef!: HTMLElement;

  @Method() getHtmlElement(): HTMLElement {
    return this.htmlRef;
  }

  get text(): string {
    const {
      infoText, pageIndex, pageCount, totalCount,
    } = this.props as Required<InfoTextProps>;
    return format(infoText,
      (pageIndex + 1).toString(),
      pageCount.toString(),
      totalCount.toString());
  }
}
