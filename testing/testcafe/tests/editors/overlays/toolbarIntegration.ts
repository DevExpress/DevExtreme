import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import Popup from '../../../model/popup';
import Popover from '../../../model/popover';
import Toolbar from '../../../model/toolbar/toolbar';
import { safeSizeTest } from '../../../helpers/safeSizeTest';

fixture`Popup_toolbar`
  .page(url(__dirname, '../../container.html'));

[
  { name: 'dxPopup', Class: Popup },
  { name: 'dxPopover', Class: Popover },
].forEach(({ name, Class }) => {
  ['bottom', 'top'].forEach((toolbar) => {
    [true, false].forEach((rtlEnabled) => {
      safeSizeTest(`Extended toolbar should be used in ${name},rtlEnabled=${rtlEnabled},toolbar=${toolbar}`, async (t) => {
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
        const instance = new Class('#container');

        if (toolbar === 'top') {
          const topToolbar = new Toolbar(instance.getToolbar());
          await topToolbar.option('overflowMenuVisible', true);
        } else {
          const bottomToolbar = new Toolbar(instance.getBottomToolbar());
          await bottomToolbar.option('overflowMenuVisible', true);
        }

        await t.hover(instance.getCloseButton().element);

        await testScreenshot(t, takeScreenshot, `${name.replace('dx', '')}_${toolbar}_toolbar_menu,rtlEnabled=${rtlEnabled}.png`);

        await t
          .expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      }, [600, 400]).before(async () => createWidget(name as 'dxPopup' | 'dxPopover', {
        showCloseButton: true,
        // eslint-disable-next-line no-multi-str
        contentTemplate: () => $('<div>').text('\
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.\
            Lorem Ipsum has been the industrys standard dummy text ever since the 1500s,\
            when an unknown printer took a galley of type and scrambled it to make a type specimen book.\
        '),
        width: '60%',
        height: 300,
        showTitle: true,
        rtlEnabled,
        visible: true,
        animation: undefined,
        target: '#container',
        hideOnOutsideClick: true,
        toolbarItems: [{
          location: 'before',
          widget: 'dxButton',
          options: {
            type: 'back',
          },
          toolbar,
        }, {
          location: 'before',
          widget: 'dxButton',
          locateInMenu: 'auto',
          options: {
            icon: 'refresh',
          },
          toolbar,
        }, {
          location: 'center',
          locateInMenu: 'never',
          template() {
            return $('<div><b>Popup\'s</b> title</div>');
          },
          toolbar,
        }, {
          location: 'after',
          widget: 'dxSelectBox',
          locateInMenu: 'auto',
          options: {
            width: 140,
            items: [1, 2, 3, 4, 5],
            value: 3,
          },
          toolbar,
        }, {
          location: 'after',
          widget: 'dxButton',
          locateInMenu: 'auto',
          options: {
            icon: 'plus',
          },
          toolbar,
        }, {
          locateInMenu: 'always',
          widget: 'dxButton',
          options: {
            icon: 'save',
            text: 'Save',
          },
          toolbar,
        }, {
          widget: 'dxButton',
          toolbar: toolbar === 'top'
            ? 'bottom'
            : 'top',
          location: 'before',
          options: {
            icon: 'email',
          },
        }, {
          widget: 'dxButton',
          toolbar: toolbar === 'top'
            ? 'bottom'
            : 'top',
          location: 'after',
          options: {
            text: 'Close',
          },
        }],
      }));
    });
  });
});
