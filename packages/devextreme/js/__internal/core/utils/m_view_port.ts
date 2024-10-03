import $ from '../renderer';
import callbacks from './callbacks';
import readyCallbacks from './ready_callbacks';

const ready = readyCallbacks.add;
const changeCallback = callbacks();
let $originalViewPort = $();

const value = (function () {
  let $current;

  return function (element) {
    if (!arguments.length) {
      return $current;
    }

    const $element = $(element);
    $originalViewPort = $element;
    const isNewViewportFound = !!$element.length;
    const prevViewPort = value();
    $current = isNewViewportFound ? $element : $('body');
    changeCallback.fire(isNewViewportFound ? value() : $(), prevViewPort);
  };
}());

ready(() => {
  value('.dx-viewport');
});

export {
  changeCallback,
  value,
};

export function originalViewPort() {
  return $originalViewPort;
}
