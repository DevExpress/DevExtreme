import $ from '@js/core/renderer';
import callbacks from '@js/core/utils/callbacks';
import readyCallbacks from '@js/core/utils/ready_callbacks';

const ready = readyCallbacks.add;
const changeCallback = callbacks();
let $originalViewPort = $();

const value: any = (function () {
  let $current;

  return function(element) {
      if(!arguments.length) {
          return $current;
      }

      const $element = $(element);
      $originalViewPort = $element;
      const isNewViewportFound = !!$element.length;
      const prevViewPort = value();
      $current = isNewViewportFound ? $element : $('body');
      changeCallback.fire(isNewViewportFound ? value() : $(), prevViewPort);
  };
})();

ready(function() {
  value('.dx-viewport');
});


export {
  changeCallback,
  value,
};

export function originalViewPort() {
  return $originalViewPort;
}
