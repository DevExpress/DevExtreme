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
      keyFn: props[templateMeta.keyFn],
    };
  }

  if (props[templateMeta.render]) {
    return {
      optionName: templateMeta.tmplOption,
      isAnonymous: true,
      type: 'render',
      content: props[templateMeta.render],
      keyFn: props[templateMeta.keyFn],
    };
  }

  if (props[templateMeta.component]) {
    return {
      optionName: templateMeta.tmplOption,
      isAnonymous: true,
      type: 'component',
      content: props[templateMeta.component],
      keyFn: props[templateMeta.keyFn],
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
      keyFn: props.keyFn,
    };
  }

  if (props.render) {
    return {
      optionName: props.name,
      isAnonymous: false,
      type: 'render',
      content: props.render,
      keyFn: props.keyFn,
    };
  }

  return {
    optionName: props.name,
    isAnonymous: false,
    type: 'children',
    content: props.children,
    keyFn: props.keyFn,
  };
}

export {
  getAnonymousTemplate,
  getNamedTemplate,
};
