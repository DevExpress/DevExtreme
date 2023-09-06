import IVue from "vue";
declare class TemplatesManager {
    private _component;
    private _slots;
    private _templates;
    private _isDirty;
    constructor(component: IVue);
    discover(): void;
    get templates(): Record<string, object>;
    get isDirty(): boolean;
    resetDirtyFlag(): void;
    private _prepareTemplates;
    private createDxTemplate;
}
export { TemplatesManager };
