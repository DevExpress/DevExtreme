import callbacks from '@js/core/component_registrator_callbacks';
import errors from '@js/core/errors';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { name as publicComponentName } from '@js/core/utils/public_component';

interface ComponentInstance {
  [member: string]: unknown;
  option: (options?: unknown) => unknown;
}

type ComponentMember = (...args: unknown[]) => unknown;

interface ComponentClass {
  getInstance: (element: Element) => ComponentInstance | undefined;
  new (element: Element, options?: unknown): ComponentInstance;
}

type ComponentNamespace = Record<string, ComponentClass>;

function registerComponent(name: string, componentClass: ComponentClass): void;
function registerComponent(
  name: string,
  namespace: ComponentNamespace,
  componentClass: ComponentClass,
): void;
function registerComponent(
  name: string,
  namespace: ComponentNamespace | ComponentClass,
  componentClass?: ComponentClass,
): void {
  let registeredClass = componentClass;

  if (!registeredClass) {
    registeredClass = namespace as ComponentClass;
  } else {
    (namespace as ComponentNamespace)[name] = registeredClass;
  }

  publicComponentName(registeredClass, name);
  callbacks.fire(name, registeredClass);
}

const registerRendererComponent = (name: string, componentClass: ComponentClass): void => {
  // @ts-expect-error 'fn' does not exist on type
  // '(selector?: string | Element | dxElementWrapper | undefined) => dxElementWrapper'
  $.fn[name] = function (
    this: dxElementWrapper,
    options?: unknown,
    ...memberArgs: unknown[]
  ): unknown {
    if (typeof options === 'string') {
      const memberName = options;
      const firstResult: { value: unknown } = { value: undefined };

      this.each(function (this: Element) {
        const instance = componentClass.getInstance(this);

        if (!instance) {
          throw errors.Error('E0009', name);
        }

        const member = instance[memberName] as ComponentMember;
        const memberValue = member.apply(instance, memberArgs);

        if (firstResult.value === undefined) {
          firstResult.value = memberValue;
        }

        return true;
      });

      return firstResult.value;
    }

    this.each(function (this: Element) {
      const instance = componentClass.getInstance(this);

      if (instance) {
        instance.option(options);
      } else {
        // eslint-disable-next-line new-cap, no-new
        new componentClass(this, options);
      }

      return true;
    });

    return this;
  };
};

callbacks.add(registerRendererComponent);

export { registerComponent };
