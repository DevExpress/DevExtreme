import { Selector, ClientFunction } from 'testcafe';
import { WidgetName } from '../../helpers/createWidget';
import type { PlatformType } from '../../helpers/multi-platform-test/platform-type';
import { getComponentInstance } from '../../helpers/multi-platform-test';
import { isObject } from '../../../../js/core/utils/type';

const CLASS = {
  focused: 'dx-state-focused',
  hovered: 'dx-state-hover',
  active: 'dx-state-active',
};

export default abstract class Widget {
  getInstance: () => unknown;

  public element: Selector;

  public isFocused: Promise<boolean>;

  public isHovered: Promise<boolean>;

  public isActive: Promise<boolean>;

  constructor(id: string | Selector) {
    this.element = typeof id === 'string' ? Selector(id) : id;
    this.isFocused = this.element.hasClass(CLASS.focused);
    this.isHovered = this.element.hasClass(CLASS.hovered);
    this.isActive = this.element.hasClass(CLASS.active);

    this.getInstance = getComponentInstance(
      this.getTestingPlatform(), this.element, this.getName(),
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

  // eslint-disable-next-line class-methods-use-this
  getTestingPlatform(): PlatformType {
    return 'jquery';
  }

  focus(): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => { (getInstance() as any).focus(); },
      { dependencies: { getInstance } },
    )();
  }

  abstract getName(): WidgetName;
}
