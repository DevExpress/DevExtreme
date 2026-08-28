import domAdapter from '@js/core/dom_adapter';
import { each } from '@js/core/utils/iterator';
import readyCallbacks from '@js/core/utils/ready_callbacks';

export type PointerEventMap = Record<string, string>;

const addEventsListener = function (events: string, handler: (e: Event) => void): void {
  readyCallbacks.add(() => {
    events
      .split(' ')
      .forEach((event) => {
        domAdapter.listen(domAdapter.getDocument(), event, handler, true);
      });
  });
};

class Observer {
  _pointerEquals: (e: Event, pointer: Event) => boolean;

  _onPointerAdding: (e: Event) => void;

  _pointers: Event[];

  constructor(
    eventMap: PointerEventMap,
    pointerEquals: (e: Event, pointer: Event) => boolean,
    onPointerAdding?: (e: Event) => void,
  ) {
    this._pointerEquals = pointerEquals;
    this._onPointerAdding = onPointerAdding ?? ((): void => {});
    this._pointers = [];

    /* eslint-disable spellcheck/spell-checker */
    addEventsListener(eventMap.dxpointerdown, this._addPointer.bind(this));
    addEventsListener(eventMap.dxpointermove, this._updatePointer.bind(this));
    addEventsListener(eventMap.dxpointerup, this._removePointer.bind(this));
    addEventsListener(eventMap.dxpointercancel, this._removePointer.bind(this));
    /* eslint-enable spellcheck/spell-checker */
  }

  _getPointerIndex(e: Event): number {
    let index = -1;

    each(this._pointers, (i: number, pointer) => {
      if (!this._pointerEquals(e, pointer)) {
        return true;
      }

      index = i;
      return false;
    });

    return index;
  }

  _addPointer(e: Event): void {
    if (this._getPointerIndex(e) === -1) {
      this._onPointerAdding(e);
      this._pointers.push(e);
    }
  }

  _removePointer(e: Event): void {
    const index = this._getPointerIndex(e);
    if (index > -1) {
      this._pointers.splice(index, 1);
    }
  }

  _updatePointer(e: Event): void {
    const index = this._getPointerIndex(e);
    if (index > -1) {
      this._pointers[index] = e;
    }
  }

  pointers(): Event[] {
    return this._pointers;
  }

  reset(): void {
    this._pointers = [];
  }
}

export default Observer;
