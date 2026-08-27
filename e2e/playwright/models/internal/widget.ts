import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from '../types';

const CLASS = {
  focused: 'dx-state-focused',
  hovered: 'dx-state-hover',
  active: 'dx-state-active',
  disabled: 'dx-state-disabled',
};

export default abstract class Widget {
  public static className = '';

  public readonly page: Page;

  public readonly element: Locator;

  constructor(page: Page, selector: Locator | string) {
    this.page = page;
    this.element = typeof selector === 'string' ? page.locator(selector) : selector;
  }

  static addClassPrefix(widgetName: string, className: string): string {
    return `dx-${widgetName.slice(2).toLowerCase() + (className ? `-${className}` : '')}`;
  }

  public isFocused(): Promise<boolean> {
    return this.hasClass(CLASS.focused);
  }

  public isHovered(): Promise<boolean> {
    return this.hasClass(CLASS.hovered);
  }

  public isActive(): Promise<boolean> {
    return this.hasClass(CLASS.active);
  }

  public isDisabled(): Promise<boolean> {
    return this.hasClass(CLASS.disabled);
  }

  public async hasClass(className: string): Promise<boolean> {
    const classes = await this.element.getAttribute('class');

    return classes?.split(' ').includes(className) ?? false;
  }

  public async option(option: string | Record<string, unknown>, ...value: unknown[]): Promise<any> {
    const isSetter = value.length > 0 || typeof option === 'object';

    return isSetter
      ? this.invoke('option', option, ...value)
      : this.invoke('option', option);
  }

  public async focus(): Promise<void> {
    await this.invoke('focus');
  }

  public async repaint(): Promise<void> {
    await this.invoke('repaint');
  }

  public async invoke(method: string, ...args: unknown[]): Promise<any> {
    return this.element.evaluate(
      (element, { name, methodArgs, widgetName }) => {
        const $element = $(element);
        const data = $element.data();
        const widgetNames = data.dxComponents ?? [];

        if (!widgetNames.length) {
          throw new Error(`jQuery widget not found for element ${element.outerHTML.slice(0, 100)}`);
        }

        const instance = data[widgetName] ?? data[widgetNames[0]];

        return instance[name](...methodArgs);
      },
      { name: method, methodArgs: args, widgetName: this.getName() },
    );
  }

  abstract getName(): WidgetName;
}
