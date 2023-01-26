import React from 'react';
import { getDateBoxLayoutItemConfig } from '../dateBox';

describe('API', () => {
  describe('getDateBoxLayoutItemConfig', () => {
    it('should return correct config', () => {
      const dateBoxLayoutItemConfig = getDateBoxLayoutItemConfig(
        <div />,
        'dateField',
        2,
        'dateBox label',
      );

      expect(dateBoxLayoutItemConfig)
        .toEqual({
          template: expect.any(Function),
          colSpan: 2,
          dataField: 'dateField',
          label: {
            text: 'dateBox label',
          },
          validationRules: [{ type: 'required' }],
        });
    });
  });
});
