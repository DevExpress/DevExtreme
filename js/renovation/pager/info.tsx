import {
  Component, ComponentBindings, JSXComponent, OneWay, Method, Ref,
} from 'devextreme-generator/component_declaration/common';
import { formatNumber } from '../../localization';
import { format } from '../../core/utils/string';
import type { GetHtmlElement } from './resizable-container';

export const PAGER_INFO_CLASS = 'dx-info';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({ text, htmlRef }: InfoText) => (
  <div ref={htmlRef as any} className={PAGER_INFO_CLASS}>{text}</div>
);

@ComponentBindings()
export class InfoTextProps {
  @OneWay() infoText?: string;

  @OneWay() pageCount?: number = 10;

  @OneWay() pageIndex ? = 0;

  @OneWay() totalCount ? = 0;
}

// tslint:disable-next-line: max-classes-per-file
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class InfoText extends JSXComponent<InfoTextProps> implements GetHtmlElement {
  @Ref() htmlRef!: HTMLElement;

  @Method() getHtmlElement(): HTMLElement {
    return this.htmlRef;
  }

  get text(): string {
    const {
      infoText, pageIndex, pageCount, totalCount,
    } = this.props as Required<InfoTextProps>;
    return format(infoText,
      formatNumber(pageIndex + 1, ''),
      formatNumber(pageCount, ''),
      formatNumber(totalCount, ''));
  }
}
