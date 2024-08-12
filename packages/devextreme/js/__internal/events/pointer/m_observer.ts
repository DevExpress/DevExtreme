import domAdapter from '@js/core/dom_adapter';
import { each } from '@js/core/utils/iterator';
import readyCallbacks from '@js/core/utils/ready_callbacks';

const addEventsListener = function (events, handler) {
  readyCallbacks.add(() => {
    events
      .split(' ')
      .forEach((event) => {
        // @ts-expect-error
        domAdapter.listen(domAdapter.getDocument(), event, handler, true);
      });
  });
};

const Observer = function (eventMap, pointerEquals, onPointerAdding) {
  onPointerAdding = onPointerAdding || function () { };

  let pointers: any = [];

  const getPointerIndex = function (e) {
    let index = -1;

    each(pointers, (i: any, pointer) => {
      if (!pointerEquals(e, pointer)) {
        return true;
      }

      index = i;
      return false;
    });

    return index;
  };

  const addPointer = function (e) {
    if (getPointerIndex(e) === -1) {
      onPointerAdding(e);
      pointers.push(e);
    }
  };

  const removePointer = function (e) {
    const index = getPointerIndex(e);
    if (index > -1) {
      pointers.splice(index, 1);
    }
  };

  const updatePointer = function (e) {
    pointers[getPointerIndex(e)] = e;
  };

  /* eslint-disable spellcheck/spell-checker */
  addEventsListener(eventMap.dxpointerdown, addPointer);
  addEventsListener(eventMap.dxpointermove, updatePointer);
  addEventsListener(eventMap.dxpointerup, removePointer);
  addEventsListener(eventMap.dxpointercancel, removePointer);

  this.pointers = function () {
    return pointers;
  };

  this.reset = function () {
    pointers = [];
  };
};

export default Observer;
