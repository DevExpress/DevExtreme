import { ITemplateMeta } from './template';
import { ComponentBaseProps } from './component-base-func';

const elementPropNames = ['style', 'id'];
const classNamePropName = 'className';
const refPropName = ['dropZone', 'dialogTrigger'];

type InternalProps = {
  [Property in keyof ComponentBaseProps]-?: ComponentBaseProps[Property];
}

const internalProps: InternalProps = {
  widgetClass: {},
  isPortalComponent: false,
  defaults: {},
  templateProps: [],
  expectedChildren: {},
  subscribableOptions: [],
  independentEvents: [],
  useRequestAnimationFrameFlag: false,
  clearExtensions: () => undefined,
  renderChildren: () => undefined,
  beforeCreateWidget: () => undefined,
  afterCreateWidget: () => undefined,
};

function isIgnoredProp(name: string) {
  return name === 'children' || name === classNamePropName || elementPropNames.includes(name) || internalProps.hasOwnProperty(name);
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
