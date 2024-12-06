import eventsEngine from '@js/common/core/events/core/events_engine';
import { removeEvent } from '@js/common/core/events/remove';
import { data as elementData } from '@js/core/element_data';
import { isDefined } from '@js/core/utils/type';

const COMPONENT_NAMES_DATA_KEY = 'dxComponents';
const ANONYMOUS_COMPONENT_DATA_KEY = 'dxPrivateComponent';

const componentNames = new WeakMap();
let nextAnonymousComponent = 0;

const getName = function (componentClass, newName?) {
  if (isDefined(newName)) {
    componentNames.set(componentClass, newName);
    return;
  }

  if (!componentNames.has(componentClass)) {
    const generatedName = ANONYMOUS_COMPONENT_DATA_KEY + nextAnonymousComponent++;
    componentNames.set(componentClass, generatedName);
    return generatedName;
  }

  return componentNames.get(componentClass);
};

export function attachInstanceToElement($element, componentInstance, disposeFn) {
  const data = elementData($element.get(0));
  const name = getName(componentInstance.constructor);

  data[name] = componentInstance;

  if (disposeFn) {
    eventsEngine.one($element, removeEvent, function () {
      disposeFn.call(componentInstance);
    });
  }

  if (!data[COMPONENT_NAMES_DATA_KEY]) {
    data[COMPONENT_NAMES_DATA_KEY] = [];
  }

  data[COMPONENT_NAMES_DATA_KEY].push(name);
}

export function getInstanceByElement($element, componentClass) {
  const name = getName(componentClass);

  return elementData($element.get(0), name);
}

export { getName as name };
export default { name: getName };
