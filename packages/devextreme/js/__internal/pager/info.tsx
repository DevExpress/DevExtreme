/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RefObject } from '@devextreme/runtime/inferno';
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { createRef as infernoCreateRef } from 'inferno';

import { format } from '../../core/utils/string';
import { PagerDefaultProps, type PagerProps } from './common/pager_props';
import { getLocalizationMessage } from './utils/compatibility_utils';

export const PAGER_INFO_CLASS = 'dx-info';

export interface InfoTextProps {
  rootElementRef?: RefObject<HTMLDivElement>;
}

export type InfoTextPropsType = InfoTextProps & Pick<PagerProps, 'infoText' | 'pageIndex' | 'pageCount' | 'itemCount'>;

const InfoTextDefaultProps: InfoTextPropsType = {
  pageCount: PagerDefaultProps.pageCount,
  pageIndex: PagerDefaultProps.pageIndex,
  itemCount: PagerDefaultProps.itemCount,
};

export class InfoText extends BaseInfernoComponent<InfoTextPropsType> {
  public state: any = {};

  public refs: any = null;

  // eslint-disable-next-line max-len
  public rootElementRef?: RefObject<HTMLDivElement> = infernoCreateRef() as RefObject<HTMLDivElement>;

  getInfoText(): string {
    return this.props.infoText ?? getLocalizationMessage(this.context, 'dxPagination-infoText');
  }

  getText(): string {
    const {
      pageCount,
      pageIndex,
      itemCount,
    } = this.props;
    return format(
      this.getInfoText(),
      (pageIndex + 1).toString(),
      pageCount?.toString(),
      itemCount?.toString(),
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
