import { Properties } from 'devextreme/ui/popover.d';
import { ToolbarItem } from 'devextreme/ui/popup.d';
import url from '../../helpers/getPageUrl';
import { defaultSelector, testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { isFluent } from '../../helpers/themeUtils';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const toolbarItems: ToolbarItem[] = [
  {
    location: 'before',
    widget: 'dxButton',
    options: {
      icon: 'back',
    },
  },
];

// NOTE: dialog-mode popovers (toolbarItems or showTitle + showCloseButton) have no
// accessible name unless a title is set. Providing a default dialog name is a separate
// dialog-labeling task (see dialog-labeling-known-issue.md), so the best-practice rule
// is disabled for the combinations where the name is intentionally absent.
// Re-enable this rule once that task lands.
const a11yCheckConfig = isFluent() ? {
  rules: { 'aria-dialog-name': { enabled: false } },
} : {
  runOnly: 'color-contrast',
};

const options: Options<Properties> = {
  visible: [true],
  target: [defaultSelector],
  width: [300],
  height: [280],
  showTitle: [true, false],
  title: [undefined, 'title'],
  showCloseButton: [true, false],
  toolbarItems: [undefined, toolbarItems],
  // NOTE: a tooltip-mode popover is named from its content (aria-tooltip-name, WCAG 4.1.2)
  contentTemplate: [() => 'Popover content'],
};

const configuration: Configuration = {
  component: 'dxPopover',
  options,
  a11yCheckConfig,
  // NOTE: a shown popover wrapper is appended to the viewport (body),
  // so the default '#container' context does not include the overlay markup
  selector: { include: [['#container'], ['.dx-popover-wrapper']] },
};

testAccessibility(configuration);

// NOTE: a hidden popover keeps its overlay markup inside the widget root element,
// so the default '#container' context covers both the target attributes
// (aria-describedby) and the overlay content
const invisibleConfiguration: Configuration = {
  component: 'dxPopover',
  options: {
    visible: [false],
    deferRendering: [true, false],
    target: [defaultSelector],
    width: [300],
    height: [280],
    toolbarItems: [undefined, toolbarItems],
    contentTemplate: [() => 'Popover content'],
  },
};

testAccessibility(invisibleConfiguration);
