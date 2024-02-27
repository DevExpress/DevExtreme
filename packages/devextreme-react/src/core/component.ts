import * as React from 'react';

import { ComponentBase, IHtmlOptions } from './component-base';
import { ExtensionComponent } from './extension-component';

class Component<P extends IHtmlOptions> extends ComponentBase<P> {
  // local extensionCreators
  private _extensionCreators: ((element: Element) => void)[] = [];

  constructor(props: P) {
    super(props);

    // useCallback - no binding needed
    this._registerExtension = this._registerExtension.bind(this);
  }

  public componentDidMount(): void {
    super.componentDidMount();
    this._createWidget();
    this._createExtensions();
  }

  public componentWillUnmount(): void {
    super.componentWillUnmount();
    this.clearExtensions();
  }

  // ref method
  public clearExtensions(): void {
    this._extensionCreators = [];
  }

  // useCallback
  // @ts-expect-error TS2416
  protected renderChildren(): Record<string, unknown>[] | null | undefined {
    return React.Children.map(
      // @ts-expect-error TS2339
      this.props.children,
      (child) => {
        if (child && Object.prototype.isPrototypeOf.call(ExtensionComponent, child.type)) {
          return React.cloneElement(
            child,
            { onMounted: this._registerExtension },
          );
        }

        return child;
      },
    );
  }

  // useCallback
  private _registerExtension(creator: any) {
    this._extensionCreators.push(creator);
  }

  // useCallback
  private _createExtensions() {
    this._extensionCreators.forEach((creator) => creator(this._element));
  }
}

export {
  Component,
  IHtmlOptions,
};
