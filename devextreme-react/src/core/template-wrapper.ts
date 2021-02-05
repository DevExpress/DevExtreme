import * as events from 'devextreme/events';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { DX_REMOVE_EVENT } from './component-base';

interface ITemplateWrapperProps {
  content: any;
  container: Element;
  onRemoved: () => void;
  onRendered?: () => void;
  key: string;
}

interface ITemplateWrapperState {
  removalListenerRequired: boolean;
}

type TemplateWrapperRenderer = () => TemplateWrapper;

const removalListenerStyle = { display: 'none' };

class TemplateWrapper extends React.PureComponent<ITemplateWrapperProps, ITemplateWrapperState> {
  private readonly _removalListenerRef = React.createRef<HTMLElement>();

  constructor(props: ITemplateWrapperProps) {
    super(props);

    this.state = { removalListenerRequired: false };

    this._onDxRemove = this._onDxRemove.bind(this);
  }

  public componentDidMount(): void {
    this._subscribeOnRemove();
    this.props.onRendered?.();
  }

  public componentDidUpdate(): void {
    this._subscribeOnRemove();
  }

  public componentWillUnmount(): void {
    // Let React remove it itself
    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(this);
    const { container } = this.props;

    if (node) {
      container.appendChild(node);
    }
    if (this._listenerElement) {
      container.appendChild(this._listenerElement);
    }
  }

  private get _listenerElement(): HTMLElement {
    return this._removalListenerRef.current as HTMLElement;
  }

  private _subscribeOnRemove() {
    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(this);
    const { removalListenerRequired } = this.state;

    if (node && node.nodeType === Node.ELEMENT_NODE) {
      this._subscribeOnElementRemoval(node as Element);
      return;
    }

    if (!removalListenerRequired) {
      this.setState({ removalListenerRequired: true });
      return;
    }

    if (this._listenerElement) {
      this._subscribeOnElementRemoval(this._listenerElement);
    }
  }

  private _subscribeOnElementRemoval(element: Element): void {
    events.off(element, DX_REMOVE_EVENT, this._onDxRemove);
    events.one(element, DX_REMOVE_EVENT, this._onDxRemove);
  }

  private _onDxRemove(): void {
    const { onRemoved } = this.props;
    onRemoved();
  }

  public render(): React.ReactNode {
    const { removalListenerRequired } = this.state;
    const { content, container } = this.props;
    const removalListener = removalListenerRequired
      ? React.createElement('span', { style: removalListenerStyle, ref: this._removalListenerRef })
      : undefined;

    return ReactDOM.createPortal(
      React.createElement(
        React.Fragment,
        null,
        content,
        removalListener,
      ),
      container,
    );
  }
}

export {
  ITemplateWrapperProps,
  TemplateWrapper,
  TemplateWrapperRenderer,
};
