import eventsEngine from '@js/common/core/events/core/events_engine';
import { removeEvent } from '@js/common/core/events/remove';
import { data as elementData } from '@js/core/element_data';
import type { dxElementWrapper } from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';

const COMPONENT_NAMES_DATA_KEY = 'dxComponents';

interface ComponentsData extends Record<string, unknown> {
  dxComponents?: string[];
}
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
  const data = elementData<ComponentsData>($element.get(0));
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

export function getInstanceByElement<T = any>($element, componentClass): T {
  const name = getName(componentClass);

  return elementData<T>($element.get(0), name);
}

export function getComponentInstance<T = unknown>($element: dxElementWrapper): T | undefined {
  const element = $element.get(0);

  if (!element) {
    return undefined;
  }

  const names = elementData<string[] | undefined>(element, COMPONENT_NAMES_DATA_KEY);
  const componentName = names?.[0];

  return componentName ? elementData<T>(element, componentName) : undefined;
}

export { getName as name };
export default { name: getName };
