import type { JSHandle, Page } from '@playwright/test';
import type { Properties } from 'devextreme/ui/drawer';

type ContentRenderer = ($container: JQuery) => void;

// "page.evaluate" does not pass functions, so a content renderer comes as a factory that runs in
// the page and gives back the renderer; its handle then reaches the page as the function itself.
type ContentRendererFactory = () => ContentRenderer;

interface CreateDrawerConfig {
  options?: Properties;
  createDrawerContent?: ContentRendererFactory;
  createOuterContent?: ContentRendererFactory;
  testInPopup?: boolean;
}

const toHandle = (
  page: Page,
  factory: ContentRendererFactory | undefined,
): Promise<JSHandle<ContentRenderer> | undefined> => (
  factory ? page.evaluateHandle(factory) : Promise.resolve(undefined)
);

export const createDrawer = async (page: Page, {
  options = {},
  createDrawerContent,
  createOuterContent,
  testInPopup = false,
}: CreateDrawerConfig): Promise<void> => {
  const drawerContentHandle = await toHandle(page, createDrawerContent);
  const outerContentHandle = await toHandle(page, createOuterContent);

  await page.evaluate(({
    drawerOptions, drawerContent, outerContent, inPopup,
  }) => {
    const createDrawerInt = ($container: JQuery): void => {
      if (outerContent) {
        outerContent($container);
      }

      const $drawer = $('<div id="drawer">');
      const $templateView = $('<div style="background-color: aquamarine; height: 100%;">').appendTo($drawer);

      $('<div id="inner">')
        .text('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Penatibus et magnis dis parturient. Eget dolor morbi non arcu risus. Tristique magna sit amet purus gravida quis blandit. Auctor urna nunc id cursus metus aliquam eleifend mi in.')
        .appendTo($templateView);

      ($drawer.appendTo($container) as any).dxDrawer({
        opened: true,
        shading: true,
        height: 400,
        template: () => {
          const isTopOrBottom = drawerOptions.position === 'top' || drawerOptions.position === 'bottom';
          const cssSizeProperty = isTopOrBottom ? 'width' : 'height';

          const $result = $('<div>')
            .css('background-color', 'aqua')
            .css(cssSizeProperty, '100%');

          if (isTopOrBottom) {
            $result.height('100px');
          } else {
            $result.width('200px');
          }

          if (drawerContent) {
            drawerContent($result);
          } else {
            $('<div>').text('Drawer Content').appendTo($result);
          }

          return $result;
        },
        ...drawerOptions,
      });
    };

    if (inPopup) {
      ($('<div id="showPopupBtn">').appendTo($('#container')) as any).dxButton({
        text: 'Show Popup',
        onClick: () => ($('#popup1') as any).dxPopup('instance').show(),
      });

      ($('<div id="popup1">').appendTo($('#container')) as any).dxPopup({
        position: 'top',
        height: 600,
        showTitle: false,
        contentTemplate: () => {
          const $popupTemplate = $('<div id="popup1_template">').css('background-color', 'blanchedalmond').css('height', '100%');
          createDrawerInt($popupTemplate);
          return $popupTemplate;
        },
      });
    }

    createDrawerInt($('#container'));
  }, {
    // The full Properties type is too deep for the argument typing of "page.evaluate".
    drawerOptions: options as Record<string, unknown>,
    drawerContent: drawerContentHandle,
    outerContent: outerContentHandle,
    inPopup: testInPopup,
  });
};
