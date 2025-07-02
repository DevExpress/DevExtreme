export const COMPONENTS = [
  {
    path: 'button',
    name: 'Button',
    component: import('@external/button/angular19/button.component').then((m) => m.ButtonComponent),
  },
  {
    path: 'inputs-list-in-form',
    name: 'InputsListInForm',
    component: import('@external/inputs-list-in-form/angular19/inputs-list-in-form.component').then((m) => m.InputsListInFormComponent),
  },
  {
    path: 'text-box-dynamic-styles',
    name: 'TextBoxDynamicStyles',
    component: import('@external/text-box-dynamic-styles/angular19/text-box-dynamic-styles.component').then((m) => m.TextBoxDynamicStylesComponent),
  },
];

export function findComponentByPath(path: string) {
  return COMPONENTS.find((component) => component.path === path) || null;
}
