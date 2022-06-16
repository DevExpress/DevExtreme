import React from 'react';
import { getDateBoxGroupConfig } from '../dateBoxGroup';

describe('API', () => {
  describe('getDateBoxGroupConfig', () => {
    [
      { allowTimeZoneEditing: true, expectedColSpan: 2 },
      { allowTimeZoneEditing: false, expectedColSpan: 1 },
    ].forEach(({ allowTimeZoneEditing, expectedColSpan }) => {
      it(`should return correct config if allowTimeZoneEditing=${allowTimeZoneEditing}`, () => {
        const config = getDateBoxGroupConfig(
          {
            startDateExpr: 'startDate',
            endDateExpr: 'endDate',
            startDateTimeZoneExpr: 'startDateTimeZone',
            endDateTimeZoneExpr: 'endDateTimeZone',
          } as any,
          allowTimeZoneEditing,
          <div />,
          <div />,
          <div />,
          <div />,
        );

        expect(config)
          .toEqual(
            {
              colCountByScreen: {
                lg: 2,
                xs: 1,
              },
              colSpan: 2,
              itemType: 'group',
              items: [
                {
                  colSpan: expectedColSpan,
                  dataField: 'startDate',
                  label: {
                    text: 'Start Date',
                  },
                  template: expect.any(Function),
                  validationRules: [
                    {
                      type: 'required',
                    },
                  ],
                },
                {
                  colSpan: expectedColSpan,
                  dataField: 'startDateTimeZone',
                  label: {
                    text: ' ',
                  },
                  template: expect.any(Function),
                  visible: allowTimeZoneEditing,
                  visibleIndex: 1,
                },
                {
                  colSpan: expectedColSpan,
                  dataField: 'endDate',
                  label: {
                    text: 'End Date',
                  },
                  template: expect.any(Function),
                  validationRules: [
                    {
                      type: 'required',
                    },
                  ],
                },
                {
                  colSpan: expectedColSpan,
                  dataField: 'endDateTimeZone',
                  label: {
                    text: ' ',
                  },
                  template: expect.any(Function),
                  visible: allowTimeZoneEditing,
                  visibleIndex: 3,
                },
              ],
            },
          );
      });
    });
  });
});
