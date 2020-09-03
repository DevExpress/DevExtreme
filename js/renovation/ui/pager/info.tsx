import {
  Component, JSXComponent, Method, Ref,
} from 'devextreme-generator/component_declaration/common';

import { format } from '../../../core/utils/string';
import messageLocalization from '../../../localization/message';
import { GetHtmlElement } from './common/types';
import PagerProps from './common/pager_props';

export const PAGER_INFO_CLASS = 'dx-info';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({ text, htmlRef }: InfoText) => (
  <div ref={htmlRef as any} className={PAGER_INFO_CLASS}>
    {text}
  </div>
);

type InfoTextProps = Pick<PagerProps, 'infoText' | 'pageCount' | 'pageIndex' | 'totalCount'>;

@Component({ defaultOptionRules: null, view: viewFunction })
export class InfoText extends JSXComponent<InfoTextProps>() implements GetHtmlElement {
  @Ref() htmlRef!: HTMLElement;

  @Method() getHtmlElement(): HTMLElement {
    return this.htmlRef;
  }

  get infoText(): string {
    return this.props.infoText || messageLocalization.getFormatter('dxPager-infoText')();
  }

  get text(): string {
    const {
      pageIndex, pageCount, totalCount,
    } = this.props;
    return format(this.infoText,
      (pageIndex + 1).toString(),
      pageCount.toString(),
      totalCount.toString());
  }
}
