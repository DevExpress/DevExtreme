import React from 'react';
import { getFormLayoutConfig } from '../formLayout';

describe('API', () => {
  describe('getFormLayoutConfig', () => {
    [
      {
        formData: {
          repeat: true,
          recurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=10',
        },
        expectedColSpan: 1,
        expectedRecurrenceGroupVisibility: true,
      },
      {
        formData: {
          repeat: true,
          recurrenceRule: undefined,
        },
        expectedColSpan: 2,
        expectedRecurrenceGroupVisibility: false,
      },
    ].forEach(({
      formData,
      expectedColSpan,
      expectedRecurrenceGroupVisibility,
    }) => {
      it(`should have correct items if recurrence=${!!formData.recurrenceRule}`, () => {
        const formLayout = getFormLayoutConfig(
          {
            startDateExpr: 'startDate',
            recurrenceRuleExpr: 'recurrenceRule',
          } as any,
          formData,
          true,
          <div />,
          <div />,
          <div />,
          <div />,
          <div />,
          <div />,
          <div />,
        );

        expect(formLayout)
          .toEqual([{
            colCountByScreen: { lg: 2, xs: 1 },
            colSpan: expectedColSpan,
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
            colSpan: expectedColSpan,
            itemType: 'group',
            items: [],
            name: 'recurrenceGroup',
            visible: expectedRecurrenceGroupVisibility,
          }]);
      });
    });
  });
});
