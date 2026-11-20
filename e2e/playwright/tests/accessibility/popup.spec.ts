import type { ToolbarItem, Properties } from 'devextreme/ui/popup';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const toolbarItems: ToolbarItem[] = [
  {
    locateInMenu: 'always',
    widget: 'dxButton',
    toolbar: 'top',
    options: { text: 'More info' },
  }, {
    widget: 'dxButton',
    toolbar: 'bottom',
    location: 'before',
    options: { icon: 'email', text: 'Send' },
  }, {
    widget: 'dxButton',
    toolbar: 'bottom',
    location: 'after',
    options: { text: 'Close' },
  },
];

const options: Options<Properties> = {
  width: [300],
  height: [280],
};

const visibleConfiguration: Configuration<Properties> = {
  component: 'dxPopup',
  options: {
    ...options,
    visible: [true],
    showTitle: [true, false],
    title: [undefined, 'title'],
    dragEnabled: [true, false],
    showCloseButton: [true, false],
    toolbarItems: [undefined, toolbarItems],
  },
};

testAccessibility(visibleConfiguration);

const invisibleConfiguration: Configuration<Properties> = {
  component: 'dxPopup',
  name: 'invisible',
  options: {
    ...options,
    visible: [false],
  },
};

testAccessibility(invisibleConfiguration);
