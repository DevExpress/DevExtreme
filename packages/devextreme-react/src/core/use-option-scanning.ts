/* eslint-disable max-classes-per-file, no-restricted-syntax */
import {
  Children,
  ReactNode,
  useContext,
  useMemo,
  useRef,
} from 'react';

import { NestedOptionContext, NestedOptionContextContent } from './helpers';
import { ElementType, getElementInfo, IOptionElement } from './configuration/react/element';
import { mergeNameParts } from './configuration/utils';
import { separateProps } from './widget-config';
import { IConfigNode, ITemplate } from './configuration/config-node';
import { getAnonymousTemplate, getNamedTemplate } from './configuration/react/templates';
import { ITemplateProps } from './template';

export function useOptionScanning(optionElement: IOptionElement, children: ReactNode): [
  IConfigNode,
  NestedOptionContextContent,
  boolean,
  number,
] {
  const parentContext = useContext(NestedOptionContext);

  const {
    parentFullName,
    treeUpdateToken: parentUpdateToken,
  } = parentContext;

  const updateToken = parentUpdateToken ?? Math.random();

  const path = optionElement.descriptor.isCollection ? `${mergeNameParts(
    parentFullName,
    optionElement.descriptor.name,
  )}` : parentFullName;

  const fullName = optionElement.descriptor.isCollection
    ? path
    : mergeNameParts(path, optionElement.descriptor.name);

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

  const childComponentCounter = useRef(0);

  const context: NestedOptionContextContent = useMemo(() => ({
    parentExpectedChildren: optionElement.descriptor.expectedChildren,
    parentFullName: fullName,
    treeUpdateToken: updateToken,
    getOptionComponentKey: () => {
      childComponentCounter.current += 1;
      return childComponentCounter.current;
    },
    onChildOptionsReady: (configNode, childDescriptor, childUpdateToken, childComponentKey) => {
      if (childUpdateToken !== updateToken) {
        return;
      }

      const { isCollection, name } = childDescriptor;

      if (isCollection) {
        let collection = configCollections[name];
        let collectionMap = configCollectionMaps[name];

        if (!collection) {
          collection = [];
          configCollections[name] = collection;
          collectionMap = {};
          configCollectionMaps[name] = collectionMap;
        }

        const itemIndex = collectionMap[childComponentKey] ?? collection.length;
        const collectionItem = {
          ...configNode,
          fullName: `${configNode.fullName}[${itemIndex}]`,
        };

        if (itemIndex < collection.length) {
          collection[itemIndex] = collectionItem;
        } else {
          collectionMap[childComponentKey] = itemIndex;
          collection.push(collectionItem);
        }

        return;
      }

      configs[name] = configNode;
    },
  }), [
    optionElement,
    fullName,
    updateToken,
    configCollections,
    configCollectionMaps,
    configs,
    childComponentCounter,
  ]);

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
