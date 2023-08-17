import { DxTemplateDirective } from './template';

export interface IDxTemplateHost {
    setTemplate(template: DxTemplateDirective);
};

export class DxTemplateHost {
    host: IDxTemplateHost;

    setHost(host: IDxTemplateHost) {
        this.host = host;
    }

    setTemplate(template: DxTemplateDirective) {
        this.host.setTemplate(template);
    }
}
