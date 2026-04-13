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
  onFocusIn: () => void;
  onFocusOut: (e: DxEvent) => void;
  onKeyDown: (e: KeyboardKeyDownEvent) => void;
}

export class ViewItem<
  TProperties extends ViewItemProperties = ViewItemProperties,
> extends DOMComponent<ViewItem<TProperties>, TProperties> {
  private keyboardListenerId?: string;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  override _getSynchronizableOptionsForCreateComponent(): (
    keyof DOMComponentProperties<DOMComponent<ViewItem<TProperties>, TProperties>>
  )[] {
    // @ts-expect-error
    return super._getSynchronizableOptionsForCreateComponent();
  }

  public resize(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    geometry?: { height: number; width: number | string; top: number; left: number },
  ): void {}

  public focus(): void {
    this.makeFocusable();
    focus.trigger(this.$element());
  }

  public makeFocusable(): void {
    this.$element().attr('tabindex', this.option().tabIndex);
  }

  public setTabIndex(tabIndex: number | undefined): void {
    // this.option().tabIndex;
    this.option('tabIndex', tabIndex);

    if (this.$element().attr('tabindex') !== '-1') {
      this.makeFocusable();
    }
  }

  protected attachFocusEvents(): void {
    const eventsNamespace = EVENTS_NAMESPACE;
    focus.off(this.$element(), eventsNamespace);
    focus.on(
      this.$element(),
      this.onFocusIn.bind(this),
      this.onFocusOut.bind(this),
      eventsNamespace,
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
    this.option().onFocusIn();
  }

  protected onFocusOut(e: DxEvent): void {
    this.option().onFocusOut(e);
  }

  protected onClick(): void {
    this.focus();
  }

  private onKeyDown(e: KeyboardKeyDownEvent): void {
    this.option().onKeyDown(e);
  }
}
