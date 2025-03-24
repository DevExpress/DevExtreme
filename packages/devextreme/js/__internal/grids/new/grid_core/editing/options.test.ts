/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  describe, expect, it, jest,
} from '@jest/globals';
import type * as dxForm from '@js/ui/form';
import { rerender } from 'inferno';

import { ColumnsController } from '../columns_controller';
import type { Column } from '../columns_controller/types';
import { DataController } from '../data_controller';
import { FilterController } from '../filtering';
import { ItemsController } from '../items_controller/items_controller';
import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { ToolbarController } from '../toolbar/controller';
import { EditingController } from './controller';
import { EditPopupView } from './popup/view';

const setup = (config: Options) => {
  const rootElement = document.createElement('div');

  const optionsController = new OptionsControllerMock(config);
  const filteringController = new FilterController(optionsController);
  const dataController = new DataController(optionsController, filteringController);
  const columnsController = new ColumnsController(optionsController, dataController);
  const itemsController = new ItemsController(dataController, columnsController);
  const editingController = new EditingController(
    optionsController,
    itemsController,
    columnsController,
    dataController,
  );
  const toolbarController = new ToolbarController(optionsController);
  const editPopupView = new EditPopupView(
    optionsController,
    columnsController,
    itemsController,
    editingController,
    toolbarController,
  );

  editPopupView.render(rootElement);
  rerender();

  return {
    optionsController, editingController, editPopupView, rootElement, toolbarController,
  };
};

describe('ColumnProperties', () => {
  describe('allowEditing', () => {
    describe('when it is false', () => {
      it('should make editor disabled', () => {
        const { editPopupView } = setup({
          columns: [{ dataField: 'field1', allowEditing: false }],
        });

        // @ts-expect-error private field
        const props = editPopupView.props!;

        expect((props.items[0] as dxForm.SimpleItem).editorOptions?.disabled).toBe(true);
      });
    });
  });
  describe('editorOptions', () => {
    it('should be passed to form item editorOptions', () => {
      const { editPopupView } = setup({
        columns: [{ dataField: 'field1', editorOptions: { someEditOption: 'someEditOptionValue' } }],
      });

      // @ts-expect-error private field
      const props = editPopupView.props!;

      expect((props.items[0] as dxForm.SimpleItem).editorOptions?.someEditOption).toBe('someEditOptionValue');
    });
  });
  describe('setCellValue', () => {
    it('should be used as callback for setting editor value', async () => {
      const setCellValue = jest.fn<Column['setCellValue']>((newData: any, value) => {
        newData.mycustomfield = value;
      });

      const { editPopupView, editingController } = setup({
        columns: [{
          dataField: 'field1',
          setCellValue,
        }, 'id'],
        dataSource: [{
          id: 1,
          field1: 'value1',
        }],
        keyExpr: 'id',
        editing: {
          editCardKey: 1,
        },
      });

      // @ts-expect-error private field
      const form = editPopupView.formRef.current!;

      form.getEditor('field1')!.option('value', 'qwe');

      // @ts-expect-error private field
      await editPopupView.promises.waitForAll();

      expect(setCellValue.mock.calls[0]).toMatchSnapshot();
      expect(editingController.changes.unreactive_get()).toMatchSnapshot();
    });
  });

  describe.skip('editCellTemplate', () => {
  });

  describe.skip('formItem', () => {
  });

  describe('validationRules', () => {
    it('should be passed to form item', () => {
      const { editPopupView } = setup({
        columns: [{ dataField: 'field1', validationRules: [{ type: 'required' }] }],
      });

      // @ts-expect-error private field
      const props = editPopupView.props!;

      expect((props.items[0] as dxForm.SimpleItem).validationRules?.[0].type).toBe('required');
    });
  });
});

describe('Options', () => {
  describe('editing', () => {
    describe('editCardKey', () => {
      it('should open popup with given item', () => {
        const { editPopupView } = setup({
          columns: [{
            dataField: 'field1',
          }, 'id'],
          dataSource: [{
            id: 1,
            field1: 'value1',
          }],
          keyExpr: 'id',
          editing: {
            editCardKey: 1,
          },
        });

        // @ts-expect-error private field
        const form = editPopupView.formRef.current!;

        expect(form.option('formData')).toMatchSnapshot();
      });
    });

    describe('allowAdding', () => {
      it('should add "add" button to toolbar', () => {
        const { toolbarController } = setup({
          editing: {
            allowAdding: true,
          },
        });

        expect(toolbarController.items.unreactive_get()).toMatchSnapshot();
      });
    });
    describe('allowUpdating', () => {
      it.skip('should add "edit" button to card', () => {

      });
    });
    describe('allowRemoving', () => {
      it.skip('should add "remove" button to card', () => {

      });
    });
  });
});
