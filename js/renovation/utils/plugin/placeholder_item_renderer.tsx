/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  JSXComponent, Component, ComponentBindings,
  OneWay, Template, JSXTemplate,
} from '@devextreme-generator/declarations';

export const viewFunction = ({
  props: {
    currentTemplate: CurrentTemplate, deps, column, baseTemplate,
  },
}: PlaceholderItemRenderer): JSX.Element => (
  <CurrentTemplate
    deps={deps}
    column={column}
    baseTemplate={baseTemplate}
  />
);

@ComponentBindings()
export class PlaceholderItemRendererProps {
  @Template() currentTemplate!: JSXTemplate<{ deps: any; column: any; baseTemplate: any }>;

  @Template() baseTemplate?: () => JSX.Element;

  @OneWay() deps: unknown[] = [];

  @OneWay() column: any;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class PlaceholderItemRenderer extends JSXComponent<PlaceholderItemRendererProps, 'currentTemplate'>(PlaceholderItemRendererProps) {
}
