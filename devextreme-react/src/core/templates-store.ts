import { TemplateWrapper, TemplateWrapperRenderer } from './template-wrapper';

interface TemplateInfo {
  template: TemplateWrapperRenderer;
  isDeferredRemove: boolean;
}
class TemplatesStore {
  private readonly _templates: Record<string, TemplateInfo> = {};

  private readonly _onTemplateAdded: () => void;

  constructor(onTemplateAdded: () => void) {
    this._onTemplateAdded = onTemplateAdded;
  }

  public add(templateId: string, templateFunc: TemplateWrapperRenderer): void {
    this._templates[templateId] = { template: templateFunc, isDeferredRemove: false };
    this._onTemplateAdded();
  }

  public setDeferredRemove(templateId: string, isDeferredRemove: boolean): void {
    if (this._templates[templateId]) {
      this._templates[templateId].isDeferredRemove = isDeferredRemove;
    }
  }

  private removeDefferedTemplate(): void {
    Object.entries(this._templates)
      .filter(([, templateInfo]) => (templateInfo.isDeferredRemove))
      .forEach(([templateId]) => {
        delete this._templates[templateId];
      });
  }

  public renderWrappers(): TemplateWrapper[] {
    this.removeDefferedTemplate();
    return Object.getOwnPropertyNames(this._templates).map(
      (templateId) => this._templates[templateId].template(),
    );
  }
}

export {
  TemplatesStore,
};
