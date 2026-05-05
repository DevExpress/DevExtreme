import {
  describe, expect, it,
} from '@jest/globals';
import {
  getResourceManagerMock,
} from '@ts/scheduler/__mock__/resource_manager.mock';

import { createResourceEditorModel } from './popup_utils';

describe('popup utils', () => {
  describe('createResourceEditorModel', () => {
    it('should return resource editor model', () => {
      const manager = getResourceManagerMock();

      expect(
        createResourceEditorModel(manager.resourceById),
      ).toEqual([
        {
          dataField: 'nested.priorityId',
          editorOptions: {
            dataSource: expect.anything(),
            displayExpr: 'text',
            stylingMode: 'outlined',
            valueExpr: 'id',
          },
          editorType: 'dxSelectBox',
          label: { text: 'Priority' },
        },
        {
          dataField: 'assigneeId',
          editorOptions: {
            dataSource: expect.anything(),
            displayExpr: 'name',
            stylingMode: 'outlined',
            valueExpr: 'guid',
          },
          editorType: 'dxTagBox',
          label: { text: 'Assignee' },
        },
        {
          dataField: 'roomId',
          editorOptions: {
            dataSource: expect.anything(),
            displayExpr: 'text',
            stylingMode: 'outlined',
            valueExpr: 'id',
          },
          editorType: 'dxSelectBox',
          label: { text: 'Room' },
        },
      ]);
    });

    it('Resource editor should always have label', () => {
      expect(
        createResourceEditorModel({
          roomId: { resourceIndex: 'roomId', dataAccessor: {} },
        } as any),
      ).toEqual([
        {
          dataField: 'roomId',
          editorOptions: {
            stylingMode: 'outlined',
          },
          editorType: 'dxSelectBox',
          label: {
            text: 'roomId',
          },
        },
      ]);
    });
  });
});
