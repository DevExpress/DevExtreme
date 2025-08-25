/* eslint-disable no-restricted-globals, spellcheck/spell-checker */
import { compareValues, getChanges } from './configuration/comparer';
import { buildConfig, findValue, ValueType } from './configuration/tree';
import { mergeNameParts, shallowEquals } from './configuration/utils';
import { capitalizeFirstLetter } from './helpers';
import type { IConfigNode, ITemplate } from './configuration/config-node';
import { DXTemplateCollection, GuardObject } from './types';

const optionsManagers = new Set<OptionsManager>();
let guardTimeoutHandler = -1;
let innerGuardTimeoutHandler = -1;

export function unscheduleGuards(): void {
  clearTimeout(guardTimeoutHandler);
  clearTimeout(innerGuardTimeoutHandler);
}
export function scheduleGuards(): void {
  unscheduleGuards();
  guardTimeoutHandler = window.setTimeout(() => {
    innerGuardTimeoutHandler = window.setTimeout(() => {
      optionsManagers.forEach((optionManager) => optionManager.execGuards());
    });
  });
}

class OptionsManager {
  private readonly guards: Record<string, GuardObject> = {};

  private instance: any;

  private isUpdating = false;

  private currentConfig: IConfigNode;

  private subscribableOptions: Set<string>;

  private independentEvents: Set<string>;

  constructor() {
    this.onOptionChanged = this.onOptionChanged.bind(this);
    this.wrapOptionValue = this.wrapOptionValue.bind(this);
  }

  public setInstance(
    instance: unknown,
    config: IConfigNode,
    subscribableOptions: string[],
    independentEvents: string[],
  ): void {
    this.instance = instance;
    this.currentConfig = config;
    this.subscribableOptions = new Set(subscribableOptions);
    this.independentEvents = new Set(independentEvents);
    optionsManagers.add(this);
  }

  public getInitialOptions(rootNode: IConfigNode): Record<string, unknown> {
    const config = buildConfig(rootNode, false);

    const options: Record<string, unknown> = {};

    Object.keys(config.options).forEach((key) => {
      options[key] = this.wrapOptionValue(key, config.options[key]);
    });

    return options;
  }

  // eslint-disable-next-line class-methods-use-this
  public getTemplateOptions(rootNode: IConfigNode): Record<string, ITemplate> {
    const config = buildConfig(rootNode, false);

    return config.templates;
  }

  public update(config: IConfigNode, dxtemplates: DXTemplateCollection): void {
    const changedOptions: [string, unknown][] = [];
    const optionChangedHandler = ({ value, fullName }) => {
      changedOptions.push([fullName, value]);
    };
    this.instance.on('optionChanged', optionChangedHandler);

    const changes = getChanges(config, this.currentConfig);

    if (!changes.options && !changes.templates && !changes.removedOptions.length) {
      return;
    }

    this.instance.beginUpdate();
    this.isUpdating = true;

    changes.removedOptions.forEach((optionName) => {
      this.resetOption(optionName);
    });

    if (Object.keys(dxtemplates).length > 0) {
      this.setValue(
        'integrationOptions',
        {
          templates: dxtemplates,
        },
      );
    }

    Object.keys(changes.options).forEach((key) => {
      this.setValue(key, changes.options[key]);
    });

    this.isUpdating = false;
    this.instance.off('optionChanged', optionChangedHandler);
    this.currentConfig = config;

    changedOptions.forEach(([name, value]) => {
      const currentPropValue = config.options[name];
      if (Object.prototype.hasOwnProperty.call(config.options, name)
        && currentPropValue !== value) {
        this.setValue(name, currentPropValue);
      }
    });
    this.instance.endUpdate();
  }

  public onOptionChanged(e: { name: string; fullName: string; value: unknown }): void {
    if (this.isUpdating) {
      return;
    }

    let valueDescriptor = findValue(this.currentConfig, e.fullName.split('.'));
    if (!valueDescriptor || valueDescriptor.value !== e.value) {
      this.callOptionChangeHandler(e.fullName, e.value);
    }

    valueDescriptor = findValue(this.currentConfig, e.fullName.split('.'));
    if (!valueDescriptor) {
      return;
    }

    const { value, type } = valueDescriptor;
    if (value instanceof Array && type === ValueType.Array) {
      for (let i = 0; i < value.length; i += 1) {
        const newValue = (e.value as unknown[])?.[i];

        if (value[i] !== newValue) {
          this.addGuard(e.fullName, value, newValue);
          return;
        }
      }
    } else if (type === ValueType.Complex && value instanceof Object) {
      Object.keys(value).forEach((key) => {
        const newValue = (e.value as Record<string, unknown>)?.[key];

        if (value[key] === newValue) {
          return;
        }

        this.addGuard(mergeNameParts(e.fullName, key), value[key], newValue);
      });
    } else {
      const valuesAreEqual = value === e.value;
      const valuesAreEqualObjects = !valuesAreEqual
        && value instanceof Object
        && e.value instanceof Object
        && shallowEquals(value as Record<string, unknown>, e.value as Record<string, unknown>);

      if (valuesAreEqual || valuesAreEqualObjects || this.instance.skipOptionsRollBack) {
        return;
      }

      this.addGuard(e.fullName, value, e.value);
    }
  }

  public get isInstanceSet(): boolean {
    return !!this.instance;
  }

  public dispose(): void {
    optionsManagers.delete(this);
    Object.keys(this.guards).forEach((optionName) => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.guards[optionName];
    });
    this.instance = null;
  }

  private isOptionSubscribable(optionName: string): boolean {
    return this.subscribableOptions.has(optionName);
  }

  private isIndependentEvent(optionName: string): boolean {
    return this.independentEvents.has(optionName);
  }

  private callOptionChangeHandler(optionName: string, optionValue: unknown) {
    if (!this.isOptionSubscribable(optionName)) {
      return;
    }

    const parts = optionName.split('.');
    const propName = parts[parts.length - 1];

    if (propName.startsWith('on')) {
      return;
    }

    const eventName = `on${capitalizeFirstLetter(propName)}Change`;
    parts[parts.length - 1] = eventName;
    const changeEvent = findValue(this.currentConfig, parts);

    if (!changeEvent) {
      return;
    }

    if (typeof changeEvent.value !== 'function') {
      throw new Error(
        `Invalid value for the ${eventName} property.
                ${eventName} must be a function.`,
      );
    }
    changeEvent.value(optionValue);
  }

  private wrapOptionValue(name: string, value: unknown) {
    if (name.substr(0, 2) === 'on' && typeof value === 'function') {
      return (...args: unknown[]) => {
        if (!this.isUpdating || this.isIndependentEvent(name)) {
          value(...args);
        }
      };
    }

    return value;
  }

  private addGuard(optionName: string, initialValue: unknown, latestValue: unknown): void {
    if (this.guards[optionName] !== undefined) {
      this.guards[optionName].latestValue = latestValue;
      return;
    }
    const handler = () => {
      this.setValue(optionName, initialValue);
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.guards[optionName];
    };
    this.guards[optionName] = {
      handler,
      latestValue,
    };
    scheduleGuards();
  }

  public execGuards(): void {
    Object.values(this.guards)
      .forEach((guard) => guard.handler());
  }

  private resetOption(name: string) {
    if (this.isCollectionOption(name)) {
      this.setValue(name, []);
    } else {
      this.instance.resetOption(name);
    }
  }

  private isCollectionOption(name: string): boolean {
    const valueDescriptor = findValue(this.currentConfig, name.split('.'));
    return valueDescriptor?.type === ValueType.Array;
  }

  private setValue(name: string, value: unknown) {
    if (this.guards[name]) {
      try {
        if (compareValues(this.guards[name].latestValue, value)) {
          return;
        }
      } finally {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.guards[name];
      }
    }

    this.instance.option(
      name,
      this.wrapOptionValue(name, value),
    );
  }
}

export {
  OptionsManager,
};
