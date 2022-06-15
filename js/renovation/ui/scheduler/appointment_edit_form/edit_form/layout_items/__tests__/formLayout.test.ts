import { getFormLayoutConfig } from '../formLayout';

describe('API', () => {
  describe('getFormLayoutConfig', () => {
    it('should have correct items', () => {
      const formLayout = getFormLayoutConfig(
        { startDateExpr: 'startDate' } as any,
        { repeat: true } as any,
        true,
        (): any => 'startDateEditorTemplate',
        (): any => 'endDateEditorTemplate',
        (): any => 'startDatetimeZoneEditorTemplate',
        (): any => 'endDateTimeZoneEditorTemplate',
        (): any => 'allDayEditorTemplate',
        (): any => 'repeatEditorTemplate',
        (): any => 'descriptionEditorTemplate',
      );

      expect(formLayout)
        .toEqual([{
          colCountByScreen: { lg: 2, xs: 1 },
          colSpan: 2,
          itemType: 'group',
          items: [{
            colSpan: 2,
            dataField: undefined,
            editorType: 'dxTextBox',
            label: { text: 'Subject' },
          },
          {
            colCountByScreen: { lg: 2, xs: 1 },
            colSpan: 2,
            itemType: 'group',
            items: [{
              colSpan: 2,
              dataField: 'startDate',
              label: { text: 'Start Date' },
              template: expect.any(Function),
              validationRules: [{ type: 'required' }],
            },
            {
              colSpan: 2,
              dataField: undefined,
              label: { text: ' ' },
              template: expect.any(Function),
              visible: true,
              visibleIndex: 1,
            }, {
              colSpan: 2,
              dataField: undefined,
              label: { text: 'End Date' },
              template: expect.any(Function),
              validationRules: [{ type: 'required' }],
            }, {
              colSpan: 2,
              dataField: undefined,
              label: { text: ' ' },
              template: expect.any(Function),
              visible: true,
              visibleIndex: 3,
            }],
          }, {
            colCountByScreen: { lg: 3, xs: 3 },
            colSpan: 2,
            itemType: 'group',
            items: [{
              cssClass: 'dx-appointment-form-switch',
              dataField: undefined,
              label: { location: 'right', text: 'All day' },
              template: expect.any(Function),
            },
            {
              cssClass: 'dx-appointment-form-switch',
              dataField: 'repeat',
              label: { location: 'right', text: 'Repeat' },
              template: expect.any(Function),
            }, {
              colSpan: 2,
              itemType: 'empty',
            }],
          }, {
            colSpan: 2,
            itemType: 'empty',
          }, {
            colSpan: 2,
            dataField: undefined,
            label: { text: 'Description' },
            template: expect.any(Function),
          }, {
            colSpan: 2,
            itemType: 'empty',
          }],
          name: 'mainGroup',
        }, {
          colSpan: 2,
          itemType: 'group',
          items: [],
          name: 'recurrenceGroup',
          visible: false,
        }]);
    });
  });
});
