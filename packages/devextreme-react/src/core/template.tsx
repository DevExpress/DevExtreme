import * as React from 'react';

import { memo } from 'react';

interface ITemplateMeta {
  tmplOption: string;
  component: string;
  render: string;
}

interface ITemplateProps {
  name: string;
  component?: any;
  render?: any;
  children?: any;
}

interface ITemplateArgs {
  data: any;
  index?: number;
}

const Template: React.FC<ITemplateProps> = memo(() => null);

function findProps(child: React.ReactElement): ITemplateProps | undefined {
  if (child.type !== Template) {
    return undefined;
  }
  return {
    name: child.props.name,
    render: child.props.render,
    component: child.props.component,
    children: child.props.children,
  };
}

export {
  ITemplateMeta,
  ITemplateProps,
  ITemplateArgs,
  Template,
  findProps,
};
