import IVue from "vue";
import { ScopedSlot } from "vue/types/vnode";
interface IEventBusHolder {
    eventBus: IVue;
}
declare function discover(component: IVue): Record<string, ScopedSlot>;
declare function mountTemplate(getSlot: () => ScopedSlot, parent: IVue, data: any, name: string, placeholder: Element): IVue;
export { mountTemplate, discover, IEventBusHolder };
