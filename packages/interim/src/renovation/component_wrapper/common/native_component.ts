import BaseComponentWrapper from './component'; 
import { TemplateComponent } from './types';


export class NativeComponentWrapper extends BaseComponentWrapper {

    _createTemplateComponent(templateOption: unknown): TemplateComponent | undefined {
        const templateComponent = super._createTemplateComponent(templateOption);
        return templateComponent
            ? (model: any) => {
                return templateComponent({ data: model, index: undefined as any});
            }
            : undefined;
    }
}