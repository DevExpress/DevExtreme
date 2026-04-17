import type { Page } from '@playwright/test';

interface CreateDrawerConfig {
  options?: Record<string, unknown>;
  createDrawerContent?: string;
  createOuterContent?: string;
  testInPopup?: boolean;
}

export async function createDrawer(page: Page, config: CreateDrawerConfig = {}): Promise<void> {
  const {
    options = {},
    createDrawerContent,
    createOuterContent,
    testInPopup = false,
  } = config;

  await page.evaluate(({
    opts,
    drawerContentFn,
    outerContentFn,
    inPopup,
  }: {
    opts: Record<string, unknown>;
    drawerContentFn?: string;
    outerContentFn?: string;
    inPopup: boolean;
  }) => {
    const createDrawerContent = drawerContentFn ? new Function('$container', drawerContentFn) as ($container: JQuery) => void : undefined;
    const createOuterContent = outerContentFn ? new Function('$container', outerContentFn) as ($container: JQuery) => void : undefined;

    const createDrawerInt = ($container: JQuery) => {
      if (createOuterContent) {
        createOuterContent($container);
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
          const isTopOrBottom = opts.position === 'top' || opts.position === 'bottom';
          const cssSizeProperty = isTopOrBottom ? 'width' : 'height';

          const $result = $('<div>')
            .css('background-color', 'aqua')
            .css(cssSizeProperty, '100%');

          if (isTopOrBottom) {
            $result.height('100px');
          } else {
            $result.width('200px');
          }

          if (createDrawerContent) {
            createDrawerContent($result);
          } else {
            $('<div>').text('Drawer Content').appendTo($result);
          }

          return $result;
        },
        ...opts,
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
    opts: options,
    drawerContentFn: createDrawerContent,
    outerContentFn: createOuterContent,
    inPopup: testInPopup,
  });
}
