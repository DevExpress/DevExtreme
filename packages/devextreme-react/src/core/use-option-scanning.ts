/* eslint-disable max-classes-per-file, no-restricted-syntax */
import {
  Children,
  ReactNode,
  ReactElement,
  useContext,
  useRef,
} from 'react';

import { NestedOptionContext, NestedOptionContextContent } from './helpers';
import { ElementType, getElementType, IOptionElement } from './configuration/react/element';
import { mergeNameParts } from './configuration/utils';
import { separateProps } from './widget-config';
import { IConfigNode, ITemplate } from './configuration/config-node';
import { getAnonymousTemplate, getNamedTemplate } from './configuration/react/templates';
import { ITemplateProps } from './template';

export function useOptionScanning(optionElement: IOptionElement, children: ReactNode): [
  IConfigNode,
  NestedOptionContextContent,
  number,
] {
  const parentContext = useContext(NestedOptionContext);

  const {
    parentFullName,
    treeUpdateToken: parentUpdateToken,
  } = parentContext;

  const updateToken = Math.random();

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

  Children.map(
    children,
    (child) => {
      const elementType = getElementType(child);
      if (elementType === ElementType.Unknown) {
        if (child !== null && child !== undefined && child !== false) {
          hasTranscludedContent = true;
        }
        return;
      }

      if (elementType === ElementType.Template) {
        const templateElement = child as ReactElement<ITemplateProps>;
        const template = getNamedTemplate(templateElement.props);

        if (template) {
          templates.push(template);
        }
      }
    },
  );

  const getHasTranscludedContent = () => {
    if (optionElement.descriptor.isCollection) {
      return hasTranscludedContent;
    }

    return parentFullName.length > 0 ? hasTranscludedContent : false;
  };

  optionElement.descriptor.templates.forEach((templateMeta) => {
    const template = getAnonymousTemplate(
      optionElement.props,
      templateMeta,
      getHasTranscludedContent(),
    );
    if (template) {
      templates.push(template);
    }
  });

  const childComponentCounter = useRef(0);

  const configNode: IConfigNode = {
    name: optionElement.descriptor.name,
    predefinedOptions: optionElement.descriptor.predefinedValuesProps,
    initialOptions: separatedValues.defaults,
    options: separatedValues.options,
    templates,
    configCollections,
    configs,
  };

  const context: NestedOptionContextContent = {
    parentExpectedChildren: optionElement.descriptor.expectedChildren,
    parentFullName: mergeNameParts(parentFullName, optionElement.descriptor.name),
    treeUpdateToken: updateToken,
    getOptionComponentKey: () => {
      childComponentCounter.current += 1;
      return childComponentCounter.current;
    },
    onChildOptionsReady: (childConfigNode, childDescriptor, childUpdateToken, childComponentKey) => {
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
        childConfigNode.index = itemIndex;
        childConfigNode.parentNode = configNode;

        if (itemIndex < collection.length) {
          collection[itemIndex] = childConfigNode;
        } else {
          collectionMap[childComponentKey] = itemIndex;
          collection.push(childConfigNode);
        }

        return;
      }

      childConfigNode.parentNode = configNode;
      configs[name] = childConfigNode;
    },
  };

  return [configNode, context, parentUpdateToken];
}
