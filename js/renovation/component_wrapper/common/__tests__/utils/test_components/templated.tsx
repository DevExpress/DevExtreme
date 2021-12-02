/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  ComponentBindings,
  JSXComponent,
  Slot,
  Template,
  OneWay,
} from '@devextreme-generator/declarations';
import TemplatedTestComponent from './component_wrapper/templated';

export const view = ({
  props: {
    children,
    elementTemplate: ElementTemplateComp,
    elementTemplatePayload,
    indexedTemplate: IndexedTemplateComp,
    template: TemplateComp,
    templateWithoutData: TemplateWithoutData,
    text,
  },
  restAttributes,
}: TemplatedTestWidget): JSX.Element => {
  const hasTemplate = TemplateComp
    || IndexedTemplateComp
    || ElementTemplateComp
    || TemplateWithoutData;
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
        {ElementTemplateComp && (
        <ElementTemplateComp
          data={elementTemplatePayload}
        />
        )}
        { TemplateWithoutData && (
          <TemplateWithoutData />
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

  @Template() elementTemplate?: any;

  @Template() templateWithoutData?: any;

  @OneWay() elementTemplatePayload?: any;
}

@Component({
  jQuery: {
    register: true,
    component: TemplatedTestComponent,
  },
  view,
})
export default class TemplatedTestWidget extends JSXComponent(TemplatedTestWidgetProps) {
}
