import * as React from 'react';

import { ComponentBase, IHtmlOptions } from './component-base';
import { ExtensionComponent } from './extension-component';

class Component<P> extends ComponentBase<P> {
  private _extensionCreators: Array<(element: Element) => void> = [];

  constructor(props: P) {
    super(props);

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

  public clearExtensions(): void {
    this._extensionCreators = [];
  }

  protected renderChildren(): Record<string, unknown>[] | null | undefined {
    return React.Children.map(
      this.props.children,
      (child) => {
        if (child && Object.prototype.isPrototypeOf.call(ExtensionComponent, (child as any).type)) {
          return React.cloneElement(
            child as any,
            { onMounted: this._registerExtension },
          );
        }

        return child;
      },
    );
  }

  private _registerExtension(creator: any) {
    this._extensionCreators.push(creator);
  }

  private _createExtensions() {
    this._extensionCreators.forEach((creator) => creator(this._element));
  }
}

export {
  Component,
  IHtmlOptions,
};
