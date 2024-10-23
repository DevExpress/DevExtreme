/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { Fragment } from 'inferno';

import { format } from '../../../core/utils/string';
import { combineClasses } from '../../core/r1/utils/render_utils';
import { FIRST_CHILD_CLASS, PAGINATION_PAGE_SIZE_CLASS, PAGINATION_SELECTED_PAGE_SIZE_CLASS } from '../common/consts';
import { LightButton } from '../common/light_button';
import { PaginationDefaultProps, type PaginationProps } from '../common/pagination_props';
import type { FullPageSize } from '../common/types';
import { getLocalizationMessage } from '../utils/compatibility_utils';

export interface PageSizeLargeProps {
  allowedPageSizes: FullPageSize[];
}

// eslint-disable-next-line @typescript-eslint/no-type-alias
type PageSizeLargePropsType = Pick<PaginationProps, 'pageSize' | 'pageSizeChangedInternal'> & PageSizeLargeProps;

export const PageSizeLargeDefaultProps: PageSizeLargePropsType = {
  allowedPageSizes: [],
  pageSize: PaginationDefaultProps.pageSize,
  pageSizeChangedInternal: PaginationDefaultProps.pageSizeChangedInternal,
};

export class PageSizeLarge extends BaseInfernoComponent<PageSizeLargePropsType> {
  public state: any = {};

  public refs: any = null;

  public __getterCache: any = {
    pageSizesText: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.onPageSizeChange = this.onPageSizeChange.bind(this);
  }

  getPageSizesText(): {
    className: string;
    click: () => void;
    label: string;
    text: string;
  }[] {
    if (this.__getterCache.pageSizesText !== undefined) {
      return this.__getterCache.pageSizesText;
    }
    const result = ((): {
      className: string;
      click: () => void;
      label: string;
      text: string;
    }[] => {
      const {
        pageSize,
        allowedPageSizes,
      } = this.props;
      return allowedPageSizes.map((_ref3, index) => {
        const {
          text,
          value: processedPageSize,
        } = _ref3;
        const selected = processedPageSize === pageSize;
        const className = combineClasses({
          [selected ? PAGINATION_SELECTED_PAGE_SIZE_CLASS : PAGINATION_PAGE_SIZE_CLASS]: true,
          [FIRST_CHILD_CLASS]: index === 0,
        });
        return {
          className,
          click: this.onPageSizeChange(processedPageSize),
          label: format(
            getLocalizationMessage(this.context, 'dxPagination-pageSize'),
            processedPageSize || getLocalizationMessage(this.context, 'dxPagination-pageSizesAllText'),
          ),
          text,
        };
      });
    })();
    this.__getterCache.pageSizesText = result;
    return result;
  }

  onPageSizeChange(processedPageSize): () => void {
    return () => {
      this.props.pageSizeChangedInternal(processedPageSize);
      return this.props.pageSize;
    };
  }

  componentWillUpdate(nextProps: PageSizeLargePropsType): void {
    const componentChanged = this.props.pageSize !== nextProps.pageSize
    || this.props.allowedPageSizes !== nextProps.allowedPageSizes
    || this.props.pageSizeChangedInternal !== nextProps.pageSizeChangedInternal;
    if (componentChanged) {
      this.__getterCache.pageSizesText = undefined;
    }
  }

  render(): JSX.Element {
    return (
      <Fragment>
        {
            this.getPageSizesText().map(({
              text, className, label, click,
            }) => (
              <LightButton key={text} className={className} label={label} onClick={click}>
                {text}
              </LightButton>
            ))
        }
      </Fragment>
    );
  }
}
PageSizeLarge.defaultProps = PageSizeLargeDefaultProps;
