
import { join } from 'path';
import fs from 'fs';
import WidgetsHandler from '../../src/modules/widgets-handler';


const mockError = new Error('File not found');
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn().mockImplementation((path: string) => {
      if (/reject/.test(path)) return Promise.reject(mockError);
      return Promise.resolve('');
    }),
  },
}));

describe('Widgets handler tests', () => {
  test('getIndexWidgetItems', () => {
    const widgetsHandler = new WidgetsHandler([], '');
    const indexContent = 'common content\n'
            + '@use "./commonUse";\n'
            + '// public widgets\n'
            + '@use "./accordion";\n'
            + '@use "./dateBox";\n';

    const expectedWidgetArray: Array<WidgetItem> = [
      { widgetName: 'accordion', widgetImportString: '@use "./accordion";' },
      { widgetName: 'datebox', widgetImportString: '@use "./dateBox";' },
    ];

    expect(widgetsHandler.getIndexWidgetItems(indexContent)).toEqual(expectedWidgetArray);
    expect(widgetsHandler.baseIndexContent).toBe('common content\n@use "./commonUse";\n');
  });

  test('getWidgetLists', () => {
    const userWidgets = ['accordion', 'box', 'wrongWidget', 'wrongWidget2'];
    const widgetsFromIndex: Array<WidgetItem> = [
      { widgetName: 'accordion', widgetImportString: '@use "./accordion";' },
      { widgetName: 'box', widgetImportString: '@use "./box";' },
      { widgetName: 'datebox', widgetImportString: '@use "./dateBox";' },
    ];
    const widgetsHandler = new WidgetsHandler(userWidgets, '');
    widgetsHandler.baseIndexContent = 'base content\n';

    const expected: WidgetHandlerResult = {
      widgets: ['accordion', 'box'],
      unusedWidgets: ['wrongWidget', 'wrongWidget2'],
      indexContent: 'base content\n@use "./accordion";\n@use "./box";',
    };

    expect(widgetsHandler.getWidgetLists(widgetsFromIndex)).toEqual(expected);
  });

  test('getWidgetLists with empty array', () => {
    const userWidgets: Array<string> = [];
    const widgetsFromIndex: Array<WidgetItem> = [
      { widgetName: 'accordion', widgetImportString: '@use "./accordion";' },
      { widgetName: 'box', widgetImportString: '@use "./box";' },
      { widgetName: 'datebox', widgetImportString: '@use "./dateBox";' },
    ];
    const widgetsHandler = new WidgetsHandler(userWidgets, '');
    widgetsHandler.baseIndexContent = 'base content\n';

    const expected: WidgetHandlerResult = {
      widgets: ['accordion', 'box', 'datebox'],
      unusedWidgets: [],
      indexContent: 'base content\n@use "./accordion";\n@use "./box";\n@use "./dateBox";',
    };

    expect(widgetsHandler.getWidgetLists(widgetsFromIndex)).toEqual(expected);
  });

  test('getIndexContent', async () => {
    const widgetsHandler = new WidgetsHandler([], '/path/dx.bundle.scss');
    await widgetsHandler.getIndexContent();

    expect(fs.promises.readFile).toBeCalledTimes(1);
    expect(fs.promises.readFile).toBeCalledWith(join('/', 'widgets', 'generic', '_index.scss'));
  });

  test('getIndexContent if bundle does not exists', async () => {
    const widgetsHandler = new WidgetsHandler([], '/reject/reject/bundle');

    await expect(widgetsHandler.getIndexContent()).rejects.toBe(mockError);
  });

  test('check that list of widgets will be an empty array if constructor receive null', () => {
    const widgetsHandler = new WidgetsHandler(null, '/');

    expect(widgetsHandler.widgets).toEqual([]);
  });
});
