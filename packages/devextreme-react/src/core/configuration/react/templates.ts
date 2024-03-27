import { ITemplateMeta, ITemplateProps } from 'src/core/template';
import { ITemplate } from '../config-node';

function getAnonymousTemplate(
  props: Record<string, any>,
  templateMeta: ITemplateMeta,
  hasTranscludedContent: boolean,
): ITemplate | null {
  if (templateMeta.tmplOption === 'template' && hasTranscludedContent) {
    return {
      optionName: templateMeta.tmplOption,
      isAnonymous: true,
      type: 'children',
      content: props.children,
    };
  }

  if (props[templateMeta.render]) {
    return {
      optionName: templateMeta.tmplOption,
      isAnonymous: true,
      type: 'render',
      content: props[templateMeta.render],
    };
  }

  if (props[templateMeta.component]) {
    return {
      optionName: templateMeta.tmplOption,
      isAnonymous: true,
      type: 'component',
      content: props[templateMeta.component],
    };
  }

  return null;
}

function getNamedTemplate(props: ITemplateProps): ITemplate | null {
  if (!props.name) {
    return null;
  }

  if (props.component) {
    return {
      optionName: props.name,
      isAnonymous: false,
      type: 'component',
      content: props.component,
    };
  }

  if (props.render) {
    return {
      optionName: props.name,
      isAnonymous: false,
      type: 'render',
      content: props.render,
    };
  }

  return {
    optionName: props.name,
    isAnonymous: false,
    type: 'children',
    content: props.children,
  };
}

export {
  getAnonymousTemplate,
  getNamedTemplate,
};
