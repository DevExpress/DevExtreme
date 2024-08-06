/* eslint-disable max-classes-per-file, no-restricted-syntax */
import { createContext, Context, useContext, Children, useMemo, useRef } from 'react';
import { TemplateInstantiationModel, UpdateLocker } from './types';
import { NestedOptionContext, NestedOptionContextContent } from './nested-option';
import { ElementType, getElementInfo, IOptionElement } from './configuration/react/element';
import { mergeNameParts } from './configuration/utils';
import { separateProps } from './widget-config';
import { IConfigNode, /* IInternalConfigNode, */ITemplate } from './configuration/config-node';
import { getAnonymousTemplate, getNamedTemplate } from './configuration/react/templates';
import { ITemplateProps } from './template';

export const RemovalLockerContext: Context<UpdateLocker | undefined> = createContext<UpdateLocker | undefined>(undefined);

// eslint-disable-next-line @typescript-eslint/no-extra-parens
export const RestoreTreeContext: Context<(() => void) | undefined> = createContext<(() => void) | undefined>(undefined);

export function generateID(): string {
  return Math.random().toString(36).substring(2);
}

export class DoubleKeyMap<TKey1, TKey2, TValue> {
  private readonly _map: Map<TKey1, Map<TKey2, TValue>> = new Map();

  public set({ key1, key2 }: { key1: TKey1; key2: TKey2 }, value: TValue): void {
    let innerMap = this._map.get(key1);
    if (!innerMap) {
      innerMap = new Map<TKey2, TValue>();
      this._map.set(key1, innerMap);
    }

    innerMap.set(key2, value);
  }

  public get({ key1, key2 }: { key1: TKey1; key2: TKey2 }): TValue | undefined {
    const innerMap = this._map.get(key1);
    return innerMap ? innerMap.get(key2) : undefined;
  }

  public delete({ key1, key2 }: { key1: TKey1; key2: TKey2 }): void {
    const innerMap = this._map.get(key1);
    if (!innerMap) {
      return;
    }

    innerMap.delete(key2);
    if (innerMap.size === 0) {
      this._map.delete(key1);
    }
  }

  public clear(): void {
    this._map.clear();
  }

  public get empty(): boolean {
    return this._map.size === 0;
  }

  * [Symbol.iterator](): Generator<[{ key1: TKey1; key2: TKey2 }, TValue]> {
    for (const [key1, innerMap] of this._map) {
      for (const [key2, value] of innerMap) {
        yield [{ key1, key2 }, value];
      }
    }
  }
}

export class TemplateInstantiationModels extends DoubleKeyMap<any, HTMLElement, TemplateInstantiationModel> {}

export function capitalizeFirstLetter(text: string): string {
  if (text.length) {
    return `${text[0].toUpperCase()}${text.substr(1)}`;
  }
  return '';
}

export function useOptionScanning(optionElement: IOptionElement, children: any): [
  IConfigNode,
  NestedOptionContextContent,
  boolean,
  number,
] {
  const parentContext = useContext(NestedOptionContext);
  const { parentFullName } = parentContext;
  const updateToken = parentContext.updateToken ?? Math.random();

  const path = optionElement.descriptor.isCollection ? `${mergeNameParts(
    parentFullName,
    optionElement.descriptor.name,
  )}` : parentFullName;

  const fullName = optionElement.descriptor.isCollection
    ? path
    : mergeNameParts(path, optionElement.descriptor.name)

  const separatedValues = separateProps(
    optionElement.props,
    optionElement.descriptor.initialValuesProps,
    optionElement.descriptor.templates,
  );

  const configCollections: Record<string, IConfigNode[]> = {};
  const configCollectionMaps: Record<string, Record<string, number>> = {};
  const configs: Record<string, IConfigNode> = {};
  const templates: ITemplate[] = [];
  let hasTranscludedContent = false;
  let hasAnonymousTemplate = false;

  Children.map(
    children,
    (child) => {
      const element = getElementInfo(child, optionElement.descriptor.expectedChildren);
      if (element.type === ElementType.Unknown) {
        if (child !== null && child !== undefined && child !== false) {
          hasTranscludedContent = true;
        }
        return;
      }

      if (element.type === ElementType.Template) {
        const template = getNamedTemplate(element.props as ITemplateProps);

        if (template) {
          templates.push(template);
        }
        return;
      }
    },
  );

  optionElement.descriptor.templates.forEach((templateMeta) => {
    const template = getAnonymousTemplate(
      optionElement.props,
      templateMeta,
      path.length > 0 ? hasTranscludedContent : false,
    );
    if (template) {
      hasAnonymousTemplate = true;
      templates.push(template);
    }
  });

  const childKey = useRef(0);

  const context: NestedOptionContextContent = useMemo(() => ({
    parentExpectedChildren: optionElement.descriptor.expectedChildren,
    parentFullName: fullName,
    updateToken,
    takeConfigurationKey: () => childKey.current++,
    onChildOptionsReady: (configNode, optionDescriptor, token, key) => {
      if (token !== updateToken) {
        return;
      }

      if (optionDescriptor.isCollection) {
        let collection = configCollections[optionDescriptor.name];
        let collectionMap = configCollectionMaps[optionDescriptor.name];

        if (!collection) {
          collection = [];
          configCollections[optionDescriptor.name] = collection;
          collectionMap = {};
          configCollectionMaps[optionDescriptor.name] = collectionMap;
        }

        const itemIndex = collectionMap[key] ?? collection.length;
        const collectionItem = {
          ...configNode,
          fullName: `${configNode.fullName}[${itemIndex}]`,
        };

        if (itemIndex < collection.length) {
          collection[itemIndex] = collectionItem;
        }
        else {
          collectionMap[key] = itemIndex;
          collection.push(collectionItem);
        }

        return;
      }

      configs[optionDescriptor.name] = configNode;
    },
  }), [optionElement, fullName, updateToken, configCollections, configs]);

  const result: IConfigNode = {
    fullName,
    predefinedOptions: optionElement.descriptor.predefinedValuesProps,
    initialOptions: separatedValues.defaults,
    options: separatedValues.options,
    templates,
    configCollections,
    configs,
  };

  return [result, context, hasAnonymousTemplate, updateToken];
}
