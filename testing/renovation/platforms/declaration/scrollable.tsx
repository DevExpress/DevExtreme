import {
  Component, ComponentBindings, JSXComponent, InternalState, Effect, Fragment,
} from '@devextreme-generator/declarations';
import React from 'react';
import { ScrollableProps } from '../../../../js/renovation/ui/scroll_view/common/scrollable_props';
import { Scrollable } from '../../../../js/renovation/ui/scroll_view/scrollable';

const getContent = () => {
  let content = '';
  for (let i = 0; i < 10; i += 1) {
    content += 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ';
  }

  return content;
};

export const viewFunction = ({ options }: App): JSX.Element => (
  <Fragment>
    {options && (
    <Scrollable
      id="container"
      width={options.width}
      height={options.height}
      useNative={options.useNative}
      rtlEnabled={options.rtlEnabled}
      direction={options.direction}
      showScrollbar={options.showScrollbar}
    >
      <div className="text-content" style={{ minHeight: 500, minWidth: 500 }}>
        {getContent()}
      </div>
    </Scrollable>
    )}
    {!options && (
    <div>Something went wrong...</div>
    )}
  </Fragment>
);

@ComponentBindings()
class AppProps { }

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: { register: true },
})
export class App extends JSXComponent<AppProps>() {
  @InternalState() options?: Partial<ScrollableProps>;

  @Effect({ run: 'once' })
  optionsUpdated(): void {
    // eslint-disable-next-line no-restricted-globals
    (window as unknown as { onOptionsUpdated: (unknown) => void })
      .onOptionsUpdated = (newOptions) => {
        this.options = {
          ...this.options,
          ...newOptions,
        };
      };
  }
}
