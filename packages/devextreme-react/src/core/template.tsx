import * as React from 'react';

import { memo, useContext, useLayoutEffect } from 'react';
import { NestedOptionContext, TemplateRenderingContext } from './contexts';
import { getNamedTemplate } from './configuration/react/templates';

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

const Template: React.FC<ITemplateProps> = memo((props) => {
  const {
    onNamedTemplateReady,
    treeUpdateToken,
  } = useContext(NestedOptionContext);

  const { isTemplateRendering } = useContext(TemplateRenderingContext);

  const template = getNamedTemplate(props);

  useLayoutEffect(() => {
    if (!isTemplateRendering) {
      onNamedTemplateReady(template, treeUpdateToken);
    }
  }, [treeUpdateToken]);

  return null;
});

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
