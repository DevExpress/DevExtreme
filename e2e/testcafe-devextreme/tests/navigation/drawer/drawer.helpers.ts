export function createDrawer({
  openedStateMode, shading, createOuterContent, createDrawerContent, createInnerContent,
}: { [key: string]: any }): void {
  function createDrawerInt($container: any): void {
    if (createOuterContent) {
      createOuterContent($container);
    }

    const $drawer = $('<div id=\'drawer1\'>');
    const $templateView = $('<div style=\'background-color: aquamarine; height: 100%;\'>').appendTo($drawer);
    if (openedStateMode === 'overlap') {
      $templateView.css('padding-left', '200px');
    }
    if (openedStateMode === 'push') {
      $templateView.css('padding-right', '200px');
    }

    if (createInnerContent) {
      createInnerContent($templateView);
    }

    ($drawer.appendTo($container) as any).dxDrawer({
      openedStateMode,
      shading,
      opened: true,
      height: 400,
      template: () => {
        const $result = $('<div>').width(200).css('background-color', 'aqua').css('height', '100%');
        if (createDrawerContent) {
          createDrawerContent($result);
        }
        return $result;
      },
    });
  }

  ($('<div id="showPopupBtn">').appendTo($('#container')) as any)
    .dxButton({
      text: 'Show Popup',
      onClick: () => ($('#popup1') as any).dxPopup('instance').show(),
    });
  ($('<div id=\'popup1\'>').appendTo($('#container')) as any).dxPopup({
    position: 'top',
    height: 600,
    showTitle: false,
    contentTemplate: () => {
      const $popupTemplate = $('<div id="popup1_template">').css('background-color', 'blanchedalmond').css('height', '100%');
      createDrawerInt($popupTemplate);
      return $popupTemplate;
    },
  });

  createDrawerInt($('#container'));
}
