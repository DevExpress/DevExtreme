import {
  Component, ComponentBindings, JSXComponent, Fragment, InternalState, Ref, RefObject, Effect,
} from '@devextreme-generator/declarations';
import React from 'react';
import { PagerProps } from '../../../../js/renovation/ui/pager/common/pager_props';
import { Pager } from '../../../../js/renovation/ui/pager/pager';

const defaultProps: Partial<PagerProps> = {
  totalCount: 100,
  gridCompatibility: false,
  showPageSizes: true,
  pageSizes: [5, 10, 20],
  showInfo: true,
  showNavigationButtons: true,
};
const v = JSON.stringify({ showNavigationButtons: false });
export const viewFunction = ({ buttonRef, valueInputRef, componentProps }: App): JSX.Element => (
  <Fragment>
    <textarea id="jsonProps" ref={valueInputRef} />
    <input id="apply" ref={buttonRef} type="button" value="Apply" />
    <Pager
      className="pager"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...componentProps}
    />
  </Fragment>
);

@ComponentBindings()
class AppProps { }

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class App extends JSXComponent<AppProps>() {
  @Ref() valueInputRef: RefObject<HTMLTextAreaElement>;

  @Ref() buttonRef: RefObject<HTMLInputElement>;

  @InternalState() pageCount = 20;

  @InternalState() pageSize = 5;

  @InternalState() pageIndex = 5;

  @InternalState() pagerProps: { [key: string]: unknown };

  applyProps(): void {
    this.pagerProps = JSON.parse(this.valueInputRef.current.value);
  }

  @Effect({ run: 'once' }) onClickSubscribe(): void {
    this.valueInputRef.current.value = v;
    this.buttonRef.current.addEventListener('click', () => this.applyProps());
  }

  pageIndexChange(index: number): void {
    this.pageIndex = index;
  }

  pageSizeChange(size: number): void {
    this.pageCount = defaultProps.totalCount / size;
    this.pageSize = size;
  }

  get componentProps() {
    return {
      ...defaultProps,
      ...this.pagerProps,
      pageSize: this.pageSize,
      pageIndex: this.pageIndex,
      pageCount: this.pageCount,
      pageSizeChange: (x: number): void => this.pageSizeChange(x),
      pageIndexChange: (x: number): void => this.pageIndexChange(x),
    };
  }
}
