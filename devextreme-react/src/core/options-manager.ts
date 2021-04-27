import TemplatesManager from './templates-manager';

import { getChanges } from './configuration/comparer';
import { IConfigNode } from './configuration/config-node';
import { buildConfig, findValue, ValueType } from './configuration/tree';
import { mergeNameParts } from './configuration/utils';
import { capitalizeFirstLetter } from './helpers';

class OptionsManager {
  private readonly guards: Record<string, number> = {};

  private templatesManager: TemplatesManager;

  private instance: any;

  private isUpdating = false;

  private currentConfig: IConfigNode;

  private subscribableOptions: Set<string>;

  private independentEvents: Set<string>;

  constructor(templatesManager: TemplatesManager) {
    this.templatesManager = templatesManager;

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
  }

  public getInitialOptions(rootNode: IConfigNode): Record<string, unknown> {
    const config = buildConfig(rootNode, false);

    Object.keys(config.templates).forEach((key) => {
      this.templatesManager.add(key, config.templates[key]);
    });
    const options: Record<string, unknown> = {};

    Object.keys(config.options).forEach((key) => {
      options[key] = this.wrapOptionValue(key, config.options[key]);
    });

    if (this.templatesManager.templatesCount > 0) {
      options.integrationOptions = {
        templates: this.templatesManager.templates,
      };
    }

    return options;
  }

  public update(config: IConfigNode): void {
    const changes = getChanges(config, this.currentConfig);

    if (!changes.options && !changes.templates && !changes.removedOptions.length) {
      return;
    }

    this.instance.beginUpdate();
    this.isUpdating = true;

    changes.removedOptions.forEach((optionName) => {
      this.resetOption(optionName);
    });

    Object.keys(changes.templates).forEach((key) => {
      this.templatesManager.add(key, changes.templates[key]);
    });
    if (this.templatesManager.templatesCount > 0) {
      this.setValue(
        'integrationOptions',
        {
          templates: this.templatesManager.templates,
        },
      );
    }

    Object.keys(changes.options).forEach((key) => {
      this.setValue(key, changes.options[key]);
    });

    this.isUpdating = false;
    this.instance.endUpdate();

    this.currentConfig = config;
  }

  public onOptionChanged(e: { name: string, fullName: string, value: unknown }): void {
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
    if (type === ValueType.Complex && value instanceof Object) {
      Object.keys(value).forEach((key) => {
        if (value[key] === (e.value as Record<string, unknown>)[key]) {
          return;
        }
        this.setGuard(mergeNameParts(e.fullName, key), value[key]);
      });
    } else {
      if (value === e.value) {
        return;
      }
      this.setGuard(e.fullName, value);
    }
  }

  public dispose(): void {
    Object.keys(this.guards).forEach((optionName) => {
      window.clearTimeout(this.guards[optionName]);
      delete this.guards[optionName];
    });
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

  private setGuard(optionName: string, optionValue: unknown): void {
    if (this.guards[optionName] !== undefined) {
      return;
    }

    const guardId = window.setTimeout(() => {
      this.setValue(optionName, optionValue);
      window.clearTimeout(guardId);
      delete this.guards[optionName];
    });

    this.guards[optionName] = guardId;
  }

  private resetOption(name: string) {
    this.instance.resetOption(name);
  }

  private setValue(name: string, value: unknown) {
    if (this.guards[name]) {
      window.clearTimeout(this.guards[name]);
      delete this.guards[name];
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
