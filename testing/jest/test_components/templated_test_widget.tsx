import {
  Component,
  ComponentBindings,
  JSXComponent,
  Ref,
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
  templatesRootRef,
}: TemplatedTestWidget): any => {
  const hasTemplate = TemplateComp || IndexedTemplateComp;
  return (
    <div
      {...restAttributes} // eslint-disable-line react/jsx-props-no-spreading
    >
      {hasTemplate && (
      <div className="templates-root" ref={templatesRootRef}>
        {TemplateComp && (
        <TemplateComp
          data={{ simpleTemplate: text }}
          parentRef={templatesRootRef}
        />
        )}
        {IndexedTemplateComp && (
        <IndexedTemplateComp
          data={{ indexedTemplate: text }}
          index={2}
          parentRef={templatesRootRef}
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
  @Ref() templatesRootRef!: HTMLDivElement;
}
