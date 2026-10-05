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

const componentNames = new WeakMap<object, string>();
let nextAnonymousComponent = 0;

const getName = function (componentClass: object, newName?: string): string | undefined {
  if (isDefined(newName)) {
    componentNames.set(componentClass, newName);
    return undefined;
  }

  if (!componentNames.has(componentClass)) {
    const generatedName = ANONYMOUS_COMPONENT_DATA_KEY + nextAnonymousComponent;
    nextAnonymousComponent += 1;
    componentNames.set(componentClass, generatedName);
    return generatedName;
  }

  return componentNames.get(componentClass);
};

export function attachInstanceToElement(
  $element: dxElementWrapper,
  componentInstance: object,
  disposeFn?: () => void,
): void {
  const data = elementData<ComponentsData>($element.get(0));
  const name = getName(componentInstance.constructor) as string;

  data[name] = componentInstance;

  if (disposeFn) {
    eventsEngine.one($element, removeEvent, () => {
      disposeFn.call(componentInstance);
    });
  }

  if (!data[COMPONENT_NAMES_DATA_KEY]) {
    data[COMPONENT_NAMES_DATA_KEY] = [];
  }

  data[COMPONENT_NAMES_DATA_KEY].push(name);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- callers omit the type argument
export function getInstanceByElement<T = any>(
  $element: dxElementWrapper,
  componentClass: object,
): T {
  const name = getName(componentClass);

  return elementData<T>($element.get(0), name);
}

export { getName as name };
export default { name: getName };
