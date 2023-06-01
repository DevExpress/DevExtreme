import React from 'react';
import { getTimeZoneLayoutItemConfig } from '../timeZone';

describe('API', () => {
  describe('getSwitchLayoutItemConfig', () => {
    it('should return correct config', () => {
      const timeZoneLayoutItemConfig = getTimeZoneLayoutItemConfig(
        <div />,
        'data field',
        10,
        5,
        true,
      );

      expect(timeZoneLayoutItemConfig)
        .toEqual({
          template: expect.any(Function),
          colSpan: 10,
          dataField: 'data field',
          label: {
            text: ' ',
          },
          visible: true,
          visibleIndex: 5,
        });
    });
  });
});
