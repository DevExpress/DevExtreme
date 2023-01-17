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
    index,
    indexedTemplate: IndexedTemplateComp,
    indexedTemplatePayload,
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
          data={indexedTemplatePayload}
          index={index}
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

  @OneWay() index?: number = 1;

  @Template() indexedTemplate?: any;

  @OneWay() indexedTemplatePayload?: any;

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
