import { getDescriptionLayoutItemConfig } from '../description';

describe('API', () => {
  describe('getDescriptionLayoutItemConfig', () => {
    it('should return correct config', () => {
      const dateBoxLayoutItemConfig = getDescriptionLayoutItemConfig(
        (): any => 'dateBox template',
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
