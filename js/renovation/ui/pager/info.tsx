import {
  Component, ComponentBindings, ForwardRef, JSXComponent, RefObject,
} from '@devextreme-generator/declarations';

import { format } from '../../../core/utils/string';
import messageLocalization from '../../../localization/message';
import { PagerProps } from './common/pager_props';

export const PAGER_INFO_CLASS = 'dx-info';
export const viewFunction = ({ text, props: { rootElementRef } }: InfoText): JSX.Element => (
  <div ref={rootElementRef} className={PAGER_INFO_CLASS}>
    {text}
  </div>
);
@ComponentBindings()
export class InfoTextProps {
  @ForwardRef() rootElementRef?: RefObject<HTMLDivElement>;
}
type InfoTextPropsType = InfoTextProps & Pick<PagerProps, 'infoText' | 'pageCount' | 'pageIndex' | 'totalCount'>;

@Component({ defaultOptionRules: null, view: viewFunction })
export class InfoText extends JSXComponent<InfoTextPropsType>() {
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
