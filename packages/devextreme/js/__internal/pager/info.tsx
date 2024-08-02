/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RefObject } from '@devextreme/runtime/inferno';
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';

import { format } from '../../core/utils/string';
import messageLocalization from '../../localization/message';
import { InternalPagerDefaultProps, type InternalPagerProps } from './common/pager_props';

export const PAGER_INFO_CLASS = 'dx-info';

export interface InfoTextProps {
  rootElementRef?: RefObject<HTMLDivElement>;
}

export type InfoTextPropsType = InfoTextProps & Pick<InternalPagerProps, 'infoText' | 'pageIndex' | 'pageCount' | 'totalCount'>;

const InfoTextDefaultProps: InfoTextPropsType = {
  pageCount: InternalPagerDefaultProps.pageCount,
  pageIndex: InternalPagerDefaultProps.pageIndex,
  totalCount: InternalPagerDefaultProps.totalCount,
};

export class InfoText extends BaseInfernoComponent<InfoTextPropsType> {
  public state: any = {};

  public refs: any = null;

  getInfoText(): string {
    return this.props.infoText ?? messageLocalization.getFormatter('dxPager-infoText')();
  }

  getText(): string {
    const {
      pageCount,
      pageIndex,
      totalCount,
    } = this.props;
    return format(
      this.getInfoText(),
      (pageIndex + 1).toString(),
      pageCount?.toString(),
      totalCount?.toString(),
    ) as string;
  }

  render(): JSX.Element {
    return (
      <div ref={this.props.rootElementRef} className={PAGER_INFO_CLASS}>
        {this.getText()}
      </div>
    );
  }
}
InfoText.defaultProps = InfoTextDefaultProps;
