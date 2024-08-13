/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { InfernoComponent, InfernoEffect } from '@devextreme/runtime/inferno';
import type { RefObject } from 'inferno';
import { createRef } from 'inferno';

import type { EventCallback } from '../../core/r1/event_callback';
import type { DisposeEffectReturn, EffectReturn } from '../../core/r1/utils/effect_return';
import { subscribeToClickEvent } from '../../core/r1/utils/subscribe_to_event';
import { KeyboardActionContext } from './keyboard_action_context';

export interface LightButtonProps {
  children?: JSX.Element | string | number;
  className?: string;
  label?: string;
  tabIndex?: number;
  selected?: boolean;
  onClick?: EventCallback;
}

export const LightButtonDefaultProps: LightButtonProps = {
  className: '',
  label: '',
  tabIndex: 0,
  selected: false,
};

export class LightButton extends InfernoComponent<LightButtonProps> {
  public state: any = {};

  public refs: any = null;

  private readonly widgetRef: RefObject<HTMLDivElement> = createRef();

  constructor(props) {
    super(props);
    this.keyboardEffect = this.keyboardEffect.bind(this);
    this.subscribeToClick = this.subscribeToClick.bind(this);
  }

  /* istanbul ignore next: WA for Angular */
  getComponentProps(): LightButtonProps {
    return this.props;
  }

  getKeyboardContext(): any {
    if (this.context[KeyboardActionContext.id]) {
      return this.context[KeyboardActionContext.id];
    }
    return KeyboardActionContext.defaultValue;
  }

  componentWillUpdate(nextProps: LightButtonProps, nextState, context): void {
    super.componentWillUpdate(nextProps, nextState, context);
  }

  createEffects(): InfernoEffect[] {
    return [
      new InfernoEffect(this.keyboardEffect, [this.getKeyboardContext(), this.props.onClick]),
      new InfernoEffect(this.subscribeToClick, [this.props.onClick]),
    ];
  }

  updateEffects(): void {
    this._effects[0]?.update([this.getKeyboardContext(), this.props.onClick]);
    this._effects[1]?.update([this.props.onClick]);
  }

  keyboardEffect(): DisposeEffectReturn {
    return this.getKeyboardContext().registerKeyboardAction(
      this.widgetRef.current,
      this.props.onClick,
    ) as DisposeEffectReturn;
  }

  subscribeToClick(): EffectReturn {
    return subscribeToClickEvent(this.widgetRef.current, this.props.onClick);
  }

  render(): JSX.Element {
    return (
      <div
        ref={this.widgetRef}
        className={this.props.className}
        tabIndex={this.props.tabIndex}
        role="button"
        aria-label={this.props.label}
        aria-current={this.props.selected ? 'page' : undefined}
      >
      {this.props.children}
    </div>
    );
  }
}
LightButton.defaultProps = LightButtonDefaultProps;
