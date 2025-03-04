import Vue from 'vue';

const getSlot = (component: any, slotName: string) => component.$parent.$scopedSlots[slotName];

const mountTemplate = (
  component: any,
  data: any,
  name: string,
  placeholder: HTMLElement,
) => new Vue({
  el: placeholder,
  name,
  parent: component,
  render: (createElement) => {
    const content = getSlot(component, name)(data);
    if (!content) {
      return createElement('div');
    }

    return content[0];
  },
});

export const renderTemplate = (template: any, model: any, component?: any): void => {
  const placeholder = document.createElement('div');
  model.container.appendChild(placeholder);
  mountTemplate(
    component,
    model.item,
    template,
    placeholder,
  );
};
export const hasTemplate = (
  name: string,
  _props: Record<string, unknown>,
  component?: any,
): boolean => !!component.$parent.$slots[name];
