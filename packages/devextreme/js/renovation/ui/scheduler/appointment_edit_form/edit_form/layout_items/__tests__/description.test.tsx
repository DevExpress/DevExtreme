import React from 'react';
import { getDescriptionLayoutItemConfig } from '../description';

describe('API', () => {
  describe('getDescriptionLayoutItemConfig', () => {
    it('should return correct config', () => {
      const dateBoxLayoutItemConfig = getDescriptionLayoutItemConfig(
        <div />,
        'descriptionField',
        'description label',
      );

      expect(dateBoxLayoutItemConfig)
        .toEqual({
          template: expect.any(Function),
          colSpan: 2,
          dataField: 'descriptionField',
          label: {
            text: 'description label',
          },
        });
    });
  });
});
