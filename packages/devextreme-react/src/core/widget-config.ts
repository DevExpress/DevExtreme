import { ITemplateMeta } from './template';

const elementPropNames = ['style', 'id'];
const classNamePropName = 'className';
const refPropName = ['dropZone', 'dialogTrigger'];

function isIgnoredProp(name: string) {
  return name === 'children' || name === classNamePropName || elementPropNames.includes(name);
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
    const value = props[key];

    if (isIgnoredProp(key)) { return; }

    if (defaultOptionName) {
      defaults[defaultOptionName] = value;
      return;
    }

    if (knownTemplates[key]) {
      templates[key] = value;
      return;
    }

    if (refPropName.includes(key)) {
      options[key] = value && value.current ? value.current : value;
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
