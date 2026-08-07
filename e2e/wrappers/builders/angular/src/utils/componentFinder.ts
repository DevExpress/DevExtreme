export const COMPONENTS = [
  {
    path: 'button',
    name: 'Button',
    component: import('@external/button/angular/button.component').then((m) => m.ButtonComponent),
  },
  {
    path: 'inputs-list-in-form',
    name: 'InputsListInForm',
    component: import('@external/inputs-list-in-form/angular/inputs-list-in-form.component').then((m) => m.InputsListInFormComponent),
  },
  {
    path: 'select-box-nested-validator',
    name: 'SelectBoxNestedValidator',
    component: import('@external/select-box-nested-validator/angular/select-box-nested-validator.component').then((m) => m.SelectBoxNestedValidatorComponent),
  },
  {
    path: 'text-box-dynamic-styles',
    name: 'TextBoxDynamicStyles',
    component: import('@external/text-box-dynamic-styles/angular/text-box-dynamic-styles.component').then((m) => m.TextBoxDynamicStylesComponent),
  },
];

export function findComponentByPath(path: string) {
  return COMPONENTS.find((component) => component.path === path) || null;
}
