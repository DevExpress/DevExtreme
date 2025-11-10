import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { GenerateGridColumnCommandResponse } from '@js/common/ai-integration';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties as TreeListProperties } from '@js/ui/tree_list';
import TreeList from '@js/ui/tree_list';
import { AIIntegration } from '@ts/core/ai_integration/core/ai_integration';
import { TreeListModel } from '@ts/grids/tree_list/__tests__/__mock__/model/tree_list';

const SELECTORS = {
  treeListContainer: '#treeListContainer',
};

const TREELIST_CONTAINER_ID = 'treeListContainer';

const items = [
  {
    id: 1, parentId: 0, name: 'Name 1', value: 10,
  },
  {
    id: 2, parentId: 1, name: 'Name 2', value: 20,
  },
];

interface RequestResult {
  promise: Promise<GenerateGridColumnCommandResponse>;
  abort: () => void;
}

const createTreeList = async (
  options: TreeListProperties = {},
): Promise<{
  $container: dxElementWrapper;
  component: TreeListModel;
  instance: TreeList;
}> => new Promise((resolve) => {
  const $container = $('<div>')
    .attr('id', TREELIST_CONTAINER_ID)
    .appendTo(document.body);

  const instance = new TreeList($container.get(0) as HTMLDivElement, options);
  const component = new TreeListModel($container.get(0) as HTMLElement);

  jest.runAllTimers();

  resolve({
    $container,
    component,
    instance,
  });
});

const beforeTest = (): void => {
  jest.useFakeTimers();
};

const afterTest = (): void => {
  const $container = $(SELECTORS.treeListContainer);
  const treeList = ($container as any).dxTreeList('instance') as TreeList;

  treeList.dispose();
  $container.remove();
  jest.clearAllMocks();
  jest.useRealTimers();
};

describe('AI data', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when prompt is set', () => {
    it('should be rendered', async () => {
      const { component } = await createTreeList({
        dataSource: items,
        keyExpr: 'id',
        parentIdExpr: 'parentId',
        autoExpandAll: true,
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myColumn',
            ai: {
              prompt: 'Initial prompt',
              aiIntegration: new AIIntegration({
                sendRequest(): RequestResult {
                  return {
                    promise: new Promise<string>((resolve) => {
                      resolve('{"1":"AI Response 1","2":"AI Response 2"}');
                    }),
                    abort: (): void => {},
                  };
                },
              }),
            },
          },
        ],
      });

      expect(component.getDataCell(0, 3).getText()).toBe('AI Response 1');
      expect(component.getDataCell(1, 3).getText()).toBe('AI Response 2');
    });
  });
});
