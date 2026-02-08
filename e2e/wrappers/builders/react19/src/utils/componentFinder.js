const COMPONENTS = [
  {
    path: 'button',
    name: 'Button',
    component: () => import('@examples/button/react19/index.jsx')
  },
  {
    path: 'inputs-list-in-form',
    name: 'InputsListInForm',
    component: () => import('@examples/inputs-list-in-form/react19/index.jsx')
  },
  {
    path: 'select-box-nested-validator',
    name: 'SelectBoxNestedValidator',
    component: () => import('@examples/select-box-nested-validator/react19/index.jsx')
  },
  {
    path: 'text-box-dynamic-styles',
    name: 'TextBoxDynamicStyles',
    component: () => import('@examples/text-box-dynamic-styles/react19/index.jsx')
  },
  {
    path: 'chat-template-rerender',
    name: 'ChatTemplateRerender',
    component: () => import('@examples/chat-template-rerender/react19/index.jsx')
  },
  {
    path: 'gantt-template-state-update',
    name: 'GanttTemplateStateUpdate',
    component: () => import('@examples/gantt-template-state-update/react19/index.jsx')
  }
];

export function getAllComponents() {
  return COMPONENTS;
}

export function findComponentByPath(path) {
  return COMPONENTS.find(component => component.path === path) || null;
}
