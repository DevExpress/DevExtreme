import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import callbacks from '@js/core/utils/callbacks';
import readyCallbacks from '@js/core/utils/ready_callbacks';

const ready = readyCallbacks.add;
const changeCallback = callbacks();
let $originalViewPort = $();

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- getter and setter in one function
const value: any = (function () {
  // eslint-disable-next-line @typescript-eslint/init-declarations -- undefined before the first set
  let $current: dxElementWrapper | undefined;

  return function (element?: Parameters<typeof $>[0]): dxElementWrapper | undefined {
    if (!arguments.length) {
      return $current;
    }

    const $element = $(element);
    $originalViewPort = $element;
    const isNewViewportFound = !!$element.length;
    const prevViewPort = value();
    $current = isNewViewportFound ? $element : $('body');
    changeCallback.fire(isNewViewportFound ? value() : $(), prevViewPort);

    return undefined;
  };
}());

ready(() => {
  value('.dx-viewport');
});

export {
  changeCallback,
  value,
};

export function originalViewPort(): dxElementWrapper {
  return $originalViewPort;
}
