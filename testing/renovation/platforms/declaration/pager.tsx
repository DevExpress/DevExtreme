/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-restricted-globals */
import {
  Component, ComponentBindings, JSXComponent, InternalState, Effect, Fragment,
} from '@devextreme-generator/declarations';
import React from 'react';
import { Pager } from '../../../../js/renovation/ui/pager/pager';
import { InternalPagerProps } from '../../../../js/renovation/ui/pager/common/pager_props';

const message = 'Click here to show pager and copy to clipboard "onOptionsUpdated({ totalCount: 100 })"';
function click() {
  (window as unknown as { onOptionsUpdated: (unknown) => void })
    .onOptionsUpdated({ totalCount: 100 });
  navigator.clipboard.writeText('onOptionsUpdated({ totalCount: 100 })');
}
export const viewFunction = ({ options, componentProps }: App): JSX.Element => (
  <Fragment>
    {options && (
      <Pager
        id="container"
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...componentProps}
      />
    )}
    {!options && (
      <div onClick={click}>{message}</div>
    )}
  </Fragment>
);
@ComponentBindings()
class AppProps { }

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class App extends JSXComponent<AppProps>() {
  @InternalState() options?: Partial<InternalPagerProps>;

  @InternalState() pageCount = 20;

  @InternalState() pageSize = 5;

  @InternalState() pageIndex = 5;

  pageIndexChange(index: number): void {
    this.pageIndex = index;
  }

  pageSizeChange(size: number): void {
    this.pageCount = this.options.totalCount / size;
    this.pageSize = size;
  }

  @Effect({ run: 'once' })
  optionsUpdated(): void {
    (window as unknown as { onOptionsUpdated: (unknown) => void })
      .onOptionsUpdated = (newOptions: InternalPagerProps) => {
        // Emulate defaultXXX option behaviour
        const { pageIndex, pageSize, ...restProps } = newOptions;
        if (pageIndex) {
          this.pageIndex = pageIndex;
        }
        if (pageSize) {
          this.pageSize = pageSize;
        }
        this.options = {
          ...this.options,
          ...restProps,
        };
      };
  }

  get componentProps(): Partial<InternalPagerProps> {
    return {
      ...this.options,
      pageSize: this.pageSize,
      pageIndex: this.pageIndex,
      pageCount: this.pageCount,
      pageSizeChange: (x: number): void => this.pageSizeChange(x),
      pageIndexChange: (x: number): void => this.pageIndexChange(x),
    };
  }
}
