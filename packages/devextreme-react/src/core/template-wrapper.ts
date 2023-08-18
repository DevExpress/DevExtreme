import * as events from 'devextreme/events';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { DX_REMOVE_EVENT } from './component-base';

interface ITemplateWrapperProps {
  content: any;
  container: Element;
  onRemoved: () => void;
  onDidMount?: () => void;
  key: string;
}

interface ITemplateWrapperState {
  removalListenerRequired: boolean;
}

type TemplateWrapperRenderer = () => TemplateWrapper;

const removalListenerStyle = { display: 'none' };

enum TableNodeNames {
  TABLE = 'tbody',
  TBODY = 'tr',
}

class TemplateWrapper extends React.PureComponent<ITemplateWrapperProps, ITemplateWrapperState> {
  private readonly _removalListenerRef = React.createRef<HTMLElement>();

  private element: HTMLElement | undefined | null;

  private hiddenElement: HTMLElement | undefined | null;

  constructor(props: ITemplateWrapperProps) {
    super(props);

    this.state = { removalListenerRequired: false };

    this._onDxRemove = this._onDxRemove.bind(this);
    this.getPreviousSiblingNode = this.getPreviousSiblingNode.bind(this);
  }

  public componentDidMount(): void {
    this._subscribeOnRemove();
    this.props.onDidMount?.();
  }

  public componentDidUpdate(): void {
    this._subscribeOnRemove();
  }

  public componentWillUnmount(): void {
    // Let React remove it itself
    const node = this.element;
    const hiddenNode = this.hiddenElement;
    const { container } = this.props;

    if (node) {
      container.appendChild(node);
    }
    if (hiddenNode) {
      container.appendChild(hiddenNode);
    }
    if (this._listenerElement) {
      container.appendChild(this._listenerElement);
    }
  }

  private get _listenerElement(): HTMLElement {
    return this._removalListenerRef.current as HTMLElement;
  }

  private getPreviousSiblingNode(node: HTMLDivElement | null) {
    this.hiddenElement = node;
    this.element = node?.previousSibling as HTMLElement;
  }

  private _subscribeOnRemove() {
    const node = this.element;
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
    const nodeName = TableNodeNames[container.nodeName] || 'div';

    return ReactDOM.createPortal(
      React.createElement(
        React.Fragment,
        null,
        content,
        content && React.createElement(
          nodeName,
          { style: { display: 'none' }, ref: this.getPreviousSiblingNode },
        ),
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
