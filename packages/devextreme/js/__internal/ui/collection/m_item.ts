import Class from '@js/core/class';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { each } from '@js/core/utils/iterator';
import { attachInstanceToElement, getInstanceByElement } from '@js/core/utils/public_component';
import type { CollectionWidgetItem } from '@js/ui/collection/ui.collection_widget.base';

const INVISIBLE_STATE_CLASS = 'dx-state-invisible';
const DISABLED_STATE_CLASS = 'dx-state-disabled';
const ITEM_CONTENT_PLACEHOLDER_CLASS = 'dx-item-content-placeholder';

interface Watcher {
  dispose: () => void;
  force: () => void;
}

const forcibleWatcher = <T>(
  watchMethod: (
    fn: () => void,
    callback: (value: T) => void
  ) => () => void,
  fn: () => T,
  callback: (value: T, oldValue: T) => void,
): Watcher => {
  const filteredCallback = ((): ((value: T) => void) => {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let oldValue: T;
    return (value: T): void => {
      if (oldValue !== value) {
        callback(value, oldValue);
        oldValue = value;
      }
    };
  })();

  return {
    dispose: watchMethod(fn, filteredCallback),
    force(): void {
      filteredCallback(fn());
    },
  };
};

export interface ItemExtraOption<TProperties, T = boolean> {
  owner: Record<string, unknown>;
  fieldGetter: (
    field: keyof TProperties
  ) => (rawData: TProperties | undefined) => T;
  watchMethod: () => (
    fn: () => void,
    callback: (value: T) => void
  ) => () => void;
}

class CollectionItem<
  TProperties extends CollectionWidgetItem = CollectionWidgetItem,
  // @ts-expect-error dxClass inheritance issue
  // eslint-disable-next-line @typescript-eslint/ban-types
> extends (Class.inherit({}) as new() => {}) {
  _dirty?: boolean;

  _watchers!: Watcher[];

  _$element!: dxElementWrapper;

  _options!: ItemExtraOption<TProperties>;

  _rawData?: TProperties;

  ctor(
    $element: dxElementWrapper,
    options: ItemExtraOption<TProperties>,
    rawData: TProperties,
  ): void {
    this._$element = $element;
    this._options = options;
    this._rawData = rawData;

    attachInstanceToElement($element, this, this._dispose);

    this._render();
  }

  _render(): void {
    const $placeholder = $('<div>').addClass(ITEM_CONTENT_PLACEHOLDER_CLASS);
    this._$element.append($placeholder);

    this._watchers = [];
    this._renderWatchers();
  }

  _renderWatchers(): void {
    this._startWatcher('disabled', this._renderDisabled.bind(this));
    this._startWatcher('visible', this._renderVisible.bind(this));
  }

  _startWatcher(
    field: keyof TProperties,
    render: (
      value: boolean | undefined,
      oldValue: boolean | undefined,
    ) => void,
  ): void {
    const rawData = this._rawData;
    const exprGetter = this._options.fieldGetter(field);

    const watcher = forcibleWatcher<boolean>(
      this._options.watchMethod(),
      () => exprGetter(rawData),
      (value, oldValue) => {
        this._dirty = true;
        render(value, oldValue);
      },
    );

    this._watchers.push(watcher);
  }

  setDataField(): boolean {
    this._dirty = false;

    each(this._watchers, (_, watcher) => {
      watcher.force();
    });

    return this._dirty;
  }

  _renderDisabled(
    value: boolean | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    oldValue?: boolean | undefined,
  ): void {
    this._$element.toggleClass(DISABLED_STATE_CLASS, !!value);
    this._$element.attr('aria-disabled', !!value);

    this._updateOwnerFocus(value);
  }

  _updateOwnerFocus(isDisabled: boolean | undefined): void {
    const ownerComponent = this._options.owner;

    if (ownerComponent && isDisabled) {
      // @ts-expect-error ts-error
      ownerComponent._resetItemFocus(this._$element);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _renderVisible(
    value: boolean | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    oldValue?: boolean,
  ): void {
    this._$element.toggleClass(INVISIBLE_STATE_CLASS, value !== undefined && !value);
  }

  _dispose(): void {
    each(this._watchers, (_, watcher) => {
      watcher.dispose();
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getInstance<T = CollectionItem<any>>($element: dxElementWrapper): T {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return getInstanceByElement($element, this);
  }
}

export default CollectionItem;
