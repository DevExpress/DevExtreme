import ReactDOM from 'react-dom';
import * as React from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const renderTemplate = (template: any, model: any, _component?: any): void => {
  const TemplateProp = template;
  const container = model.container ? model.container : model.item;

  if (typeof TemplateProp !== 'string' || !(template instanceof Element)) {
    ReactDOM.render(
      /* eslint-disable react/jsx-props-no-spreading */
      <TemplateProp {...model} /> as React.ReactElement,
      container ? model.container : model.item,
    );
  }
};

export const hasTemplate = (
  name: string,
  props: Record<string, unknown>,
  _component?: any,
): boolean => {
  const value = props[name];
  return !!value && typeof value !== 'string';
};

export const getTemplate = (TemplateProp: any, RenderProp: any, ComponentProp: any): any => {
  if (TemplateProp) {
    return TemplateProp.defaultProps ? (props: any) => <TemplateProp {...props} /> : TemplateProp;
  } if (RenderProp) {
    return (props: any) => RenderProp(
      ...('data' in props ? [props.data, props.index] : [props]),
    );
  } if (ComponentProp) {
    return (props: any) => <ComponentProp {...props} />;
  }
  return '';
};
