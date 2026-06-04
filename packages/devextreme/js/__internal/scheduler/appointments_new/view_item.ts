import type { DxEvent } from '@js/events';
import type { DOMComponentProperties } from '@ts/core/widget/dom_component';
import DOMComponent from '@ts/core/widget/dom_component';
import type { KeyboardKeyDownEvent } from '@ts/events/core/m_keyboard_processor';
import { focus, keyboard } from '@ts/events/m_short';

export const EVENTS_NAMESPACE = { namespace: 'dxSchedulerViewItem' };

export interface ViewItemProperties
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extends DOMComponentProperties<ViewItem<any>> {
  tabIndex: number;
  sortedIndex: number;
  onFocusIn: (sortedIndex: number) => void;
  onFocusOut: (e: DxEvent, sortedIndex: number) => void;
  onKeyDown: (viewItem: ViewItem, e: KeyboardKeyDownEvent) => void;
}

export class ViewItem<
  TProperties extends ViewItemProperties = ViewItemProperties,
> extends DOMComponent<ViewItem<TProperties>, TProperties> {
  private keyboardListenerId?: string;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  override _getSynchronizableOptionsForCreateComponent():
  (keyof DOMComponentProperties<DOMComponent<ViewItem<TProperties>, TProperties>>)[] {
    // @ts-expect-error
    return super._getSynchronizableOptionsForCreateComponent();
  }

  override _dispose(): void {
    super._dispose();

    focus.off(this.$element(), EVENTS_NAMESPACE);
    keyboard.off(this.keyboardListenerId);
  }

  public resize(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    geometry?: { height: number; width: number | string; top: number; left: number },
  ): void {}

  public setTabIndex(tabIndex: number | undefined): void {
    this.option('tabIndex', tabIndex);
  }

  protected attachFocusEvents(): void {
    focus.off(this.$element(), EVENTS_NAMESPACE);
    focus.on(
      this.$element(),
      this.onFocusIn.bind(this),
      this.onFocusOut.bind(this),
      EVENTS_NAMESPACE,
    );
  }

  protected attachKeydownEvents(): void {
    keyboard.off(this.keyboardListenerId);
    this.keyboardListenerId = keyboard.on(
      this.$element(),
      this.$element(),
      this.onKeyDown.bind(this),
    );
  }

  protected onFocusIn(): void {
    this.option().onFocusIn(this.option().sortedIndex);
  }

  protected onFocusOut(e: DxEvent): void {
    this.option().onFocusOut(e, this.option().sortedIndex);
  }

  private onKeyDown(e: KeyboardKeyDownEvent): void {
    this.option().onKeyDown(this, e);
  }
}
