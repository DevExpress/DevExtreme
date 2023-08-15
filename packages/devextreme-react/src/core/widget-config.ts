import { ITemplateMeta } from './template';

const elementPropNames = ['style', 'id'];
const classNamePropName = 'className';

function isIgnoredProp(name: string) {
  return name === 'children' || name === classNamePropName || elementPropNames.indexOf(name) > -1;
}

function separateProps(
  props: Record<string, any>,
  defaultsProps: Record<string, string>,
  templateProps: ITemplateMeta[],
): {
    options: Record<string, any>;
    defaults: Record<string, any>;
    templates: Record<string, any>;
  } {
  templateProps = templateProps || [];
  const defaults: Record<string, any> = {};
  const options: Record<string, any> = {};
  const templates: Record<string, any> = {};

  const knownTemplates: Record<string, any> = {};

  templateProps.forEach((value) => {
    knownTemplates[value.component] = true;
    knownTemplates[value.render] = true;
  });

  Object.keys(props).forEach((key) => {
    const defaultOptionName = defaultsProps ? defaultsProps[key] : null;

    if (isIgnoredProp(key)) { return; }

    if (defaultOptionName) {
      defaults[defaultOptionName] = props[key];
      return;
    }

    if (knownTemplates[key]) {
      templates[key] = props[key];
      return;
    }

    options[key] = props[key];
  });

  return { options, defaults, templates };
}

function getClassName(props: Record<string, any>): string | undefined {
  return props[classNamePropName];
}

export {
  elementPropNames,
  getClassName,
  separateProps,
};
