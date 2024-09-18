import * as React from 'react';
import {
  Children,
  ReactNode,
  ReactElement,
  useContext,
  useRef,
  useLayoutEffect,
} from 'react';

import { NestedOptionContext, NestedOptionContextContent, TemplateDiscoveryContext } from './helpers';
import { ElementType, getElementType, IOptionElement } from './configuration/react/element';
import { mergeNameParts } from './configuration/utils';
import { separateProps } from './widget-config';
import { IConfigNode, ITemplate } from './configuration/config-node';
import { getAnonymousTemplate, getNamedTemplate } from './configuration/react/templates';
import { ITemplateProps } from './template';

function wrapTemplate(template: ITemplate): ITemplate {
  return template.type === 'children' ? {
    ...template,
    content: React.createElement(
      TemplateDiscoveryContext.Provider,
      {
        value: {
          discoveryRendering: true,
        },
      },
      template.content,
    ),
  } : template;
}

export function useOptionScanning(
  optionElement: IOptionElement,
  children: ReactNode,
  templateContainer: HTMLDivElement,
  parentUpdateToken: number,
): [
    IConfigNode,
    NestedOptionContextContent,
  ] {
  const parentContext = useContext(NestedOptionContext);

  const {
    parentFullName,
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

  Children.map(
    children,
    (child) => {
      const elementType = getElementType(child);
      if (elementType === ElementType.Template) {
        const templateElement = child as ReactElement<ITemplateProps>;
        const template = getNamedTemplate(templateElement.props);

        if (template) {
          templates.push(template);
        }
      }
    },
  );

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

  useLayoutEffect(() => {
    configNode.templates = configNode.templates.filter((template) => !template.isAnonymous);
    const hasTranscludedContent = templateContainer.childNodes.length > 0;

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
        configNode.templates.push(wrapTemplate(template));
      }
    });
  }, [parentUpdateToken]);

  return [configNode, context];
}
