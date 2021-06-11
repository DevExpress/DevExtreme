import { join } from 'path';
import fs from 'fs';
import WidgetsHandler from '../../src/modules/widgets-handler';

const mockError = new Error('File not found');
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn().mockImplementation(async (path: string) => {
      if (path.includes('reject')) return Promise.reject(mockError);
      return Promise.resolve('');
    }),
  },
}));

describe('Widgets handler tests', () => {
  test('getIndexWidgetItems', () => {
    const widgetsHandler = new WidgetsHandler([], '', {});
    const indexContent = 'common content\n'
            + '@use "./commonUse";\n'
            + '// public widgets\n'
            + '@use "./accordion";\n'
            + '@use "./dateBox";\n';

    const expectedWidgetArray: WidgetItem[] = [
      { widgetName: 'accordion', widgetImportString: '@use "./accordion";' },
      { widgetName: 'datebox', widgetImportString: '@use "./dateBox";' },
    ];

    expect(widgetsHandler.getIndexWidgetItems(indexContent)).toEqual(expectedWidgetArray);
    expect(widgetsHandler.baseIndexContent).toBe('common content\n@use "./commonUse";\n');
  });

  test('getWidgetLists', () => {
    const userWidgets = ['Accordion', 'box', 'wrongWidget', 'wrongWidget2'];
    const widgetsFromIndex: WidgetItem[] = [
      { widgetName: 'accordion', widgetImportString: '@use "./accordion";' },
      { widgetName: 'box', widgetImportString: '@use "./box";' },
      { widgetName: 'datebox', widgetImportString: '@use "./dateBox";' },
    ];
    const widgetsHandler = new WidgetsHandler(userWidgets, '', {});
    widgetsHandler.baseIndexContent = 'base content\n';

    const expected: WidgetHandlerResult = {
      widgets: ['accordion', 'box'],
      unusedWidgets: ['wrongwidget', 'wrongwidget2'],
      indexContent: 'base content\n@use "./accordion";\n@use "./box";',
    };

    expect(widgetsHandler.getWidgetLists(widgetsFromIndex)).toEqual(expected);
  });

  test('getWidgetLists with empty array', () => {
    const userWidgets: string[] = [];
    const widgetsFromIndex: WidgetItem[] = [
      { widgetName: 'accordion', widgetImportString: '@use "./accordion";' },
      { widgetName: 'box', widgetImportString: '@use "./box";' },
      { widgetName: 'datebox', widgetImportString: '@use "./dateBox";' },
    ];
    const widgetsHandler = new WidgetsHandler(userWidgets, '', {});
    widgetsHandler.baseIndexContent = 'base content\n';

    const expected: WidgetHandlerResult = {
      widgets: ['accordion', 'box', 'datebox'],
      unusedWidgets: [],
      indexContent: 'base content\n@use "./accordion";\n@use "./box";\n@use "./dateBox";',
    };

    expect(widgetsHandler.getWidgetLists(widgetsFromIndex)).toEqual(expected);
  });

  test('getIndexContent', async () => {
    const widgetsHandler = new WidgetsHandler([], '/path/dx.light.scss', {});
    await widgetsHandler.getIndexContent();

    expect(fs.promises.readFile).toBeCalledTimes(1);
    expect(fs.promises.readFile).toBeCalledWith(join('/', 'widgets', 'generic', '_index.scss'));
    (fs.promises.readFile as jest.Mock).mockClear();
  });

  test('getIndexContent (material)', async () => {
    const widgetsHandler = new WidgetsHandler([], '/path/dx.material.blue.light.scss', {});
    await widgetsHandler.getIndexContent();

    expect(fs.promises.readFile).toBeCalledTimes(1);
    expect(fs.promises.readFile).toBeCalledWith(join('/', 'widgets', 'material', '_index.scss'));
    (fs.promises.readFile as jest.Mock).mockClear();
  });

  test('getIndexContent if bundle does not exists', async () => {
    const widgetsHandler = new WidgetsHandler([], '/reject/reject/bundle', {});

    await expect(widgetsHandler.getIndexContent()).rejects.toBe(mockError);
  });

  test('check that list of widgets will be an empty array if constructor receive null', () => {
    const widgetsHandler = new WidgetsHandler(null, '/', {});

    expect(widgetsHandler.widgets).toEqual([]);
  });

  test('getWidgetsWithDependencies', () => {
    const widgetsHandler = new WidgetsHandler(['box', 'accordion', 'popup'], '', {});
    widgetsHandler.dependencies = {
      accordion: ['box', 'overlay', 'button'],
      box: [],
      popup: ['overlay', 'toolbar'],
    };

    const expectedWidgetsList = [
      'box',
      'accordion',
      'overlay',
      'button',
      'popup',
      'toolbar',
    ];

    expect(widgetsHandler.getWidgetsWithDependencies().sort())
      .toEqual(expectedWidgetsList.sort());
  });
});
