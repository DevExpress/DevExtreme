import { Selector, ClientFunction } from 'testcafe';
import type { WidgetName } from '../types';
import { isObject } from 'devextreme/core/utils/type';

function getComponentInstance(
  selector: Selector,
  name?: string,
): () => Promise<unknown> {
  return ClientFunction(
    () => {
      const $widgetElement = $(selector());
      const elementData = $widgetElement.data();
      const widgetNames = elementData.dxComponents;

      if (name) {
        return elementData[name] ?? elementData[widgetNames[0]];
      }
      if (widgetNames.length > 1) {
        throw new Error(`Cannot update options for multiple widgets: ${widgetNames}`);
      }
      if (widgetNames.length < 1) {
        throw new Error(`jQuery widget not found for selector $(${selector})`);
      }
      return elementData[widgetNames[0]];
    },
    { dependencies: { selector, name } },
  );
}

const CLASS = {
  focused: 'dx-state-focused',
  hovered: 'dx-state-hover',
  active: 'dx-state-active',
  disabled: 'dx-state-disabled',
};

export default abstract class Widget {
  public static className = '';

  getInstance: () => unknown;

  public element: Selector;

  public get isFocused(): Promise<boolean> {
    return this.element.hasClass(CLASS.focused);
  }

  public get isHovered(): Promise<boolean> {
    return this.element.hasClass(CLASS.hovered);
  }

  public get isActive(): Promise<boolean> {
    return this.element.hasClass(CLASS.active);
  }

  public get isDisabled(): Promise<boolean> {
    return this.element.hasClass(CLASS.disabled);
  }

  constructor(id: string | Selector) {
    this.element = typeof id === 'string' ? Selector(id) : id;

    this.getInstance = getComponentInstance(
      this.element,
      this.getName(),
    );
  }

  static addClassPrefix(widgetName: string, className: string): string {
    return `dx-${widgetName.slice(2).toLowerCase() + (className ? `-${className}` : '')}`;
  }

  option(option: string | { [key: string]: unknown }, value?: unknown): Promise<any> {
    const { getInstance } = this;

    const get = (): any => (getInstance() as any).option(option);
    const set = (): any => (getInstance() as any).option(option, value);

    const isSetter = arguments.length === 2 || isObject(option);

    return ClientFunction(isSetter ? set : get, {
      dependencies: {
        option, value, getInstance,
      },
    })();
  }

  focus(): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => { (getInstance() as any).focus(); },
      { dependencies: { getInstance } },
    )();
  }

  repaint(): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => { (getInstance() as any).repaint(); },
      { dependencies: { getInstance } },
    )();
  }

  abstract getName(): WidgetName;
}
