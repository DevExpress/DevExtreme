import * as PropTypes from 'prop-types';
import * as React from 'react';

interface ITemplateMeta {
  tmplOption: string;
  component: string;
  render: string;
  keyFn: string;
}

interface ITemplateProps {
  name: string;
  component?: any;
  render?: any;
  children?: any;
  keyFn?: (data: any) => string;
}

interface ITemplateArgs {
  data: any;
  index?: number;
}

class Template extends React.PureComponent<ITemplateProps, any> {
  public render(): React.ReactNode {
    return null;
  }
}

const requiredPropsCheck = (props: Record<string, any>) => {
  if (!props.component && !props.render && !props.children) {
    return new Error("The Template component requires 'component' or 'render' property");
  }
  return null;
};

(Template as any).propTypes = {
  name: PropTypes.string.isRequired,
  component: requiredPropsCheck,
  render: requiredPropsCheck,
  children: requiredPropsCheck,
};

function findProps(child: React.ReactElement<any>): ITemplateProps | undefined {
  if (child.type !== Template) {
    return undefined;
  }
  return {
    name: child.props.name,
    render: child.props.render,
    component: child.props.component,
    children: child.props.children,
    keyFn: child.props.keyFn,
  };
}

export {
  ITemplateMeta,
  ITemplateProps,
  ITemplateArgs,
  Template,
  findProps,
};
