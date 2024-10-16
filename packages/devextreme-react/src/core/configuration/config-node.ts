import * as React from 'react';
import { separateProps } from '../widget-config';
import { IOptionElement } from './react/element';
import { getAnonymousTemplate } from './react/templates';
import { TemplateDiscoveryContext } from '../helpers';

interface IConfigNode {
  parentNode?: IConfigNode | undefined;
  index?: number | undefined;
  templates: ITemplate[];
  readonly name: string;
  readonly predefinedOptions: Record<string, any>;
  readonly initialOptions: Record<string, any>;
  readonly options: Record<string, any>;
  readonly configs: Record<string, IConfigNode>;
  readonly configCollections: Record<string, IConfigNode[]>;
}

interface ITemplate {
  optionName: string;
  isAnonymous: boolean;
  type: 'component' | 'render' | 'children';
  content: any;
}

interface NodeConfigBuilder {
  node: IConfigNode;
  configCollectionMaps: Record<string, Record<string, number>>;
  attachChildNode: (name: string, childNode: IConfigNode) => void;
  attachTemplate: (template: ITemplate) => void;
  getConfigCollectionData: (name: string) => [IConfigNode[], Record<string, number>];
  updateAnonymousTemplates: (hasTemplateRendered: boolean) => void;
  addCollectionNode: (name: string, collectionNode: IConfigNode, collectionNodeKey: number) => void;
  wrapTemplate: (template: ITemplate) => ITemplate;
}

function buildNodeFullName(node: IConfigNode): string {
  let currentNode: IConfigNode | undefined = node;
  let fullName = '';

  while (currentNode && currentNode.name) {
    fullName = currentNode.name.concat(
      typeof currentNode.index === 'number' ? `[${currentNode.index}]` : '',
      fullName ? `.${fullName}` : '',
    );
    currentNode = currentNode.parentNode;
  }

  return fullName;
}

const createConfigBuilder: (
  optionElement: IOptionElement,
  parentFullName: string,
) => NodeConfigBuilder = (
  optionElement,
  parentFullName,
) => {
  const separatedValues = separateProps(
    optionElement.props,
    optionElement.descriptor.initialValuesProps,
    optionElement.descriptor.templates,
  );

  return {
    node: {
      name: optionElement.descriptor.name,
      predefinedOptions: optionElement.descriptor.predefinedValuesProps,
      initialOptions: separatedValues.defaults,
      options: separatedValues.options,
      templates: [],
      configCollections: {},
      configs: {},
    },
    configCollectionMaps: {},

    getConfigCollectionData(name: string) {
      if (!this.node.configCollections[name]) {
        this.node.configCollections[name] = [];
        this.configCollectionMaps[name] = {};
      }

      return [this.node.configCollections[name], this.configCollectionMaps[name]];
    },

    attachChildNode(name, childNode) {
      childNode.parentNode = this.node;
      this.node.configs[name] = childNode;
    },

    addCollectionNode(name, collectionNode, collectionNodeKey) {
      const [collection, collectionMap] = this.getConfigCollectionData(name);
      const itemIndex = collectionMap[collectionNodeKey] ?? collection.length;
      collectionNode.index = itemIndex;
      collectionNode.parentNode = this.node;

      if (itemIndex < collection.length) {
        collection[itemIndex] = collectionNode;
      } else {
        collectionMap[collectionNodeKey] = itemIndex;
        collection.push(collectionNode);
      }
    },

    attachTemplate(template) {
      this.node.templates.push(template);
    },

    updateAnonymousTemplates(hasTemplateRendered) {
      this.node.templates = this.node.templates.filter((template) => !template.isAnonymous);

      optionElement.descriptor.templates.forEach((templateMeta) => {
        const template = getAnonymousTemplate(
          optionElement.props,
          templateMeta,
          hasTemplateRendered && (optionElement.descriptor.isCollection || parentFullName.length > 0),
        );

        if (template) {
          this.node.templates.push(this.wrapTemplate(template));
        }
      });
    },

    wrapTemplate(template) {
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
    },
  };
};

export {
  buildNodeFullName,
  createConfigBuilder,
  IConfigNode,
  ITemplate,
};
