/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  describe, expect, it, jest,
} from '@jest/globals';
import type * as dxForm from '@js/ui/form';
import { rerender } from 'inferno';

import type { Column } from '../columns_controller/types';
import { getContext } from '../di.test_utils';
import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { ToolbarController } from '../toolbar/controller';
import { EditingController } from './controller';
import { EditPopupView } from './popup/view';

const setup = (config: Options) => {
  const rootElement = document.createElement('div');

  const context = getContext(config);

  const optionsController = context.get(OptionsControllerMock);
  const editingController = context.get(EditingController);
  const toolbarController = context.get(ToolbarController);
  const editPopupView = context.get(EditPopupView);

  editPopupView.render(rootElement);
  rerender();

  const getForm = () => {
    // @ts-expect-error private field
    const form = editPopupView.formRef.current;

    if (!form) {
      throw new Error('form is not visible');
    }

    return form;
  };

  return {
    optionsController,
    editingController,
    editPopupView,
    rootElement,
    toolbarController,
    context,
    getForm,
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
  describe('setFieldValue', () => {
    it('should be used as callback for setting editor value', async () => {
      const setFieldValue = jest.fn<Column['setFieldValue']>((newData: any, value) => {
        newData.mycustomfield = value;
      });

      const { editPopupView, editingController, getForm } = setup({
        columns: [{
          dataField: 'field1',
          setFieldValue,
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

      getForm().getEditor('field1')!.option('value', 'qwe');

      // @ts-expect-error private field
      await editPopupView.promises.waitForAll();

      expect(setFieldValue.mock.calls[0]).toMatchSnapshot();
      expect(editingController.changes.peek()).toMatchSnapshot();
    });
  });

  describe('formItem', () => {
    it('should be passed to form item', () => {
      const { editPopupView } = setup({
        columns: [{ dataField: 'field1', formItem: { colSpan: 2 } }],
      });

      // @ts-expect-error private field
      const props = editPopupView.props!;

      expect((props.items[0] as dxForm.SimpleItem).colSpan).toBe(2);
    });
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
        const { getForm } = setup({
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

        expect(getForm().option('formData')).toMatchSnapshot();
      });
    });

    describe('allowAdding', () => {
      it('should add "add" button to toolbar', () => {
        const { toolbarController, optionsController } = setup({});

        expect(toolbarController.items.peek()).toEqual([]);
        optionsController.option('editing.allowAdding', 'true');
        expect(toolbarController.items.peek()).toMatchSnapshot();
      });
    });
    describe('allowUpdating', () => {
      it.skip('should add "edit" button to card', () => {
        // TODO: think how to organize test
      });
    });
    describe('allowRemoving', () => {
      it('should add "remove" button to card', () => {
        // TODO: think how to organize test
      });
    });

    describe('changes', () => {
      const config = {
        dataSource: [
          { key: 1, some_field: 'asd' },
        ],
        columns: ['some_field'],
        keyExpr: 'key',
        editing: {
          editCardKey: 1,
        },
      };
      it('should be empty initially', () => {
        const { editingController } = setup(config);
        expect(editingController.changes.peek()).toEqual([]);
      });
      it('should contain unsaved changes', async () => {
        const { editingController, editPopupView, getForm } = setup(config);

        getForm().getEditor('some_field')?.option('value', 'qwe');

        // @ts-expect-error private prop
        await editPopupView.promises.waitForAll();

        expect(editingController.changes.peek()).toMatchSnapshot();
      });
      it('should update state in editor', () => {
        const { editingController, getForm } = setup(config);

        editingController.changes.value = [{
          type: 'update',
          key: 1,
          data: { some_field: 'qwe' },
        }];

        expect(getForm().getEditor('some_field')?.option('value')).toBe('qwe');
      });
    });

    describe('form', () => {
      it('should pass options to edit form', () => {
        const { getForm } = setup({
          dataSource: [
            { key: 1, some_field: 'asd' },
          ],
          columns: ['some_field'],
          keyExpr: 'key',
          editing: {
            editCardKey: 1,
            form: { disabled: true },
          },
        });

        expect(getForm().option('disabled')).toBe(true);
      });
    });
  });
});
