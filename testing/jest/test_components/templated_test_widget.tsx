import {
  Component,
  ComponentBindings,
  JSXComponent,
  Slot,
  Template,
  OneWay,
} from 'devextreme-generator/component_declaration/common';

export const view = ({
  props: {
    children,
    indexedTemplate: IndexedTemplateComp,
    template: TemplateComp,
    text,
  },
  restAttributes,
}: TemplatedTestWidget): any => {
  const hasTemplate = TemplateComp || IndexedTemplateComp;
  return (
    <div
      {...restAttributes} // eslint-disable-line react/jsx-props-no-spreading
    >
      {hasTemplate && (
      <div className="templates-root">
        {TemplateComp && (
        <TemplateComp
          data={{ simpleTemplate: text }}
        />
        )}
        {IndexedTemplateComp && (
        <IndexedTemplateComp
          data={{ indexedTemplate: text }}
          index={2}
        />
        )}
      </div>
      )}
      {!hasTemplate && children}
    </div>
  );
};

@ComponentBindings()
export class TemplatedTestWidgetProps {
  @OneWay() text?: string = 'data';

  @Slot() children?: any;

  @Template() template?: any;

  @Template() indexedTemplate?: any;
}

@Component({
  jQuery: {
    register: true,
  },
  view,
})
export default class TemplatedTestWidget extends JSXComponent(TemplatedTestWidgetProps) {
}
